#!/usr/bin/env python3

import os
import json
import urllib.parse
from . import feed
from . import youtubedl
from . import db
import dataclasses
import logging
import hashlib
import time
import threading
import multiprocessing as mp

log = logging.getLogger("server")


def dc_to_json(obj):
    if dataclasses.is_dataclass(obj):
        tmp = dataclasses.asdict(obj)
        res = {}
        for nm, val in tmp.items():
            res[nm] = dc_to_json(val)
        return res
    elif isinstance(obj, list):
        return [dc_to_json(x) for x in obj]
    elif isinstance(obj, dict):
        return {k: dc_to_json(v) for k, v in obj.items()}
    else:
        return obj


def _verify_watch_id(s):
    for c in s:
        if c not in "abcdef0123456789":
            raise RuntimeError("Don't try to hack me")


def _url_to_name(url):
    return hashlib.sha224(url.encode('utf-8')).hexdigest()


def _ytdlp_main_loop(workdir, proxy):
    queue = db.DB(os.path.join(workdir, "data.db"))
    while True:
        item = queue.queue_get()
        if item is None:
            time.sleep(10)
            continue
        print("Processing:", item)
        vid = _url_to_name(item.link)
        item.watch = vid

        msg = youtubedl.load_video(workdir, item, proxy)
        if msg is not None:
            queue.kv_set("error", vid, msg)
            # TODO: Check try count and try again
            pass


def _ytdlp_main(workdir, proxy):
    while True:
        try:
            print("Processing videos from queue...")
            _ytdlp_main_loop(workdir, proxy)
        except Exception as exc:
            print("ERROR:", exc)
            time.sleep(10)


class Server:
    def __init__(self, workdir, proxy):
        self._workdir = workdir
        self._proxy = proxy
        tbdir = os.path.join(self._workdir, "thumbnails")
        os.makedirs(tbdir, exist_ok=True)
        self._ttl = 30

        self._db = self._open_db()

        self._th = threading.Thread(target=lambda: self._background())
        self._th.start()
        self._yt = mp.Process(target=_ytdlp_main, args=(self._workdir, proxy))
        self._yt.start()
        self.ext_auth = False

    def set_ttl(self, ttl):
        self._ttl = ttl

    def _load_user(self, user):
        return self._db.kv_get("users", user)

    def _save_user(self, user, info):
        self._db.kv_set("users", user, info)

    def check_user(self, user, password):
        if self.ext_auth:
            info = self._load_user(user)
            if info is None:
                self._save_user(user, {"password": "", "feeds": []})
            return True

        try:
            info = self._load_user(user)
            return password == info.get("password", None)
        except Exception as exc:
            logging.warning(f"Auth problem: {exc}")
            return False

    def list_user_feeds(self, user):
        u = self._load_user(user)
        res = {}
        for feed in u.get("feeds", []):
            try:
                data = self._get_feed(feed)
                data.prepare_ids()
                for item in data.items:
                    vid = _url_to_name(item.link)
                    if self.has_video(vid):
                        item.watch = vid
                res[feed] = dc_to_json(data)
            except Exception as exc:
                log.error(f"can't parse feed: {exc}")
        return res

    def subscribe(self, user, channel_id):
        info = self._load_user(user)
        info["feeds"].append(channel_id)
        self._save_user(user, info)

    def unsubscribe(self, user, channel_id):
        info = self._load_user(user)
        subscriptions = []
        for item in info["feeds"]:
            if item != channel_id:
                subscriptions.append(item)
        info["feeds"] = subscriptions
        self._save_user(user, info)

    def load_video(self, video_id: str):
        item = feed.Item()
        item.decode(video_id)
        # TODO: item.time = time.time()
        key = _url_to_name(item.link)
        self._db.kv_set("archive", key, item)
        item.watch = key
        self._db.queue_put(item)

    def remove_video(self, watch_id):
        " Remove video by sha256 name "
        _verify_watch_id(watch_id)
        nm = os.path.join(self._workdir, "video", watch_id + ".mp4")
        if os.path.exists(nm):
            os.unlink(nm)

    def get_video(self, link):
        " get filename for the video "
        if link.find("youtu") >= 0:
            id = _url_to_name(link)
        else:
            _verify_watch_id(link)
            id = link

        return os.path.join(self._workdir, "video", id + ".mp4")

    def local_videos(self):
        " Load local videos from archive "
        res = []
        for _, item in self._db.kv_items("archive"):
            wid = _url_to_name(item.link)
            if self.has_video(wid):
                item.watch = wid
                res.append(item)

        return dc_to_json(res)

    def search(self, query):
        " Search video on YouTube by query "
        data = youtubedl.search(self._workdir, query, self._proxy)
        data.prepare_ids()
        for item in data.items:
            vid = _url_to_name(item.link)
            if self.has_video(vid):
                item.watch = vid
        return dc_to_json(data)

    def get_image(self, url):
        " Load image into cache and return filepath of the file "
        name = _url_to_name(url) + ".jpg"
        path = os.path.join(self._workdir, "thumbnails", name)
        if os.path.exists(path):
            return path
        with urllib.request.urlopen(url) as f:
            data = f.read()
        with open(path, "wb") as out:
            out.write(data)
        return path

    def get_user_info(self, user):
        info = self._load_user(user)
        return {
            "name": user,
            "lang": info.get("lang", "en"),
            "feeds": info["feeds"],
        }

    def has_video(self, name):
        " Check if video exists "
        return os.path.exists(os.path.join(self._workdir, "video", name + ".mp4"))

    def _background(self):
        last_updates = {
            "cleanup": [0.0, 3600.0, self._yt_cleanup],
            "feeds": [0.0, 600.0, self._feed_update],
        }

        while True:
            for nm, item in last_updates.items():
                now = time.time()
                if item[0] + item[1] < now:
                    log.info(f"Running background task {nm}")
                    try:
                        item[2]()
                        item[0] = time.time()
                    except Exception as exc:
                        log.warning(f"Task {nm} failed: {exc}")

            time.sleep(30)

    def _yt_cleanup(self):
        " Remove old videos and images "
        log.info("Cleaning up old videos/images")
        rubicon = time.time() - self._ttl * 86400
        self._clean_dir(os.path.join(self._workdir, "video"), rubicon)
        self._clean_dir(os.path.join(self._workdir, "thumbnails"), rubicon)

    def _clean_dir(self, path, rubicon):
        for fnm in os.listdir(path):
            p = os.path.join(path, fnm)
            if os.path.isfile(p):
                try:
                    st = os.stat(p)
                    if st.st_ctime < rubicon:
                        os.unlink(p)
                except Exception as exc:
                    log.warning(f"Can't remove file: {p} ({exc})")

    def _feed_update(self):
        all_feeds = set()
        for _, info in self._db.kv_items("users"):
            for f in info.get("feed", []):
                all_feeds.add(f)

        for f_id in all_feeds:
            self._update_feed(f_id)

    def _update_feed(self, feed_id):
        try:
            res = feed.Feed()
            old = self._db.kv_get("rss", feed_id)
            new = feed.load_feed(feed_id)

            res.title = new.title
            news = {}
            if old is not None:
                for item in old.items:
                    news[item.link] = item
            for item in new.items:
                news[item.link] = item

            news = [n for _, n in news.items()]
            news.sort(key=lambda n: -n.time)
            if len(news) > 100:
                news = news[:100]
            res.items = news

            self._db.kv_set("rss", feed_id, res)

        except Exception as exc:
            log.warning(f"Can not update feed {feed_id}: {exc}")

    def _get_feed(self, feed_id):
        res = self._db.kv_get("rss", feed_id)
        if res is not None:
            return res
        self._update_feed(feed_id)
        return self._db.kv_get("rss", feed_id)

    def _open_db(self):
        return db.DB(os.path.join(self._workdir, "data.db"))
