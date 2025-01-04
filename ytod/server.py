#!/usr/bin/env python3

import os
import json
import urllib.parse
from . import feed
from . import youtubedl
import dataclasses
import logging
import hashlib

log = logging.getLogger("server")

def dc_to_json(obj):
    if dataclasses.is_dataclass(obj):
        tmp = dataclasses.asdict(obj)
        res = {}
        for nm, val in tmp.items():
            res[nm] = dc_to_json(val)
        return res
    elif isinstance(obj, list):
        return [ dc_to_json(x) for x in obj ]
    elif isinstance(obj, dict):
        return { k : dc_to_json(v) for k, v in obj.items() }
    else:
        return obj

def _url_to_name(url):
    return hashlib.sha224(url.encode('utf-8')).hexdigest()

class Server:
    def __init__(self, workdir):
        self._workdir = workdir
        self._ttl = 30

        os.makedirs(os.path.join(self._workdir, "users"), exist_ok=True)

        self._feed = feed.FeedLoader(workdir)
        self._yt = youtubedl.YouTubeDl(workdir)
        self._feed.run()
        self.ext_auth = False

    def set_ttl(self, ttl):
        self._ttl = ttl

    def _load_user(self, user):
        fnm = os.path.join(self._workdir, "users", urllib.parse.quote(user) + ".json")
        with open(fnm, "rt", encoding="utf-8") as f:
            return json.load(f)

    def _save_user(self, user, info):
        fnm = os.path.join(self._workdir, "users", urllib.parse.quote(user) + ".json")
        tmp = fnm + ".tmp"
        with open(tmp, "wt", encoding="utf-8") as out:
            json.dump(info, out, indent=2)
        os.rename(tmp, fnm)

    def check_user(self, user, password):
        if self.ext_auth:
            fnm = os.path.join(self._workdir, "users", urllib.parse.quote(user) + ".json")
            if not os.path.exists(fnm):
                with open(fnm, "wt", encoding="utf-8") as out:
                    out.write('{"password":"","feeds":[]}')
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
                data = self._feed.load_feed(feed)
                data.prepare_ids()
                for item in data.items:
                    vid = _url_to_name(item.link)
                    if self._yt.has_video(vid):
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
        l = []
        for item in info["feeds"]:
            if item != channel_id:
                l.append(item)
        info["feeds"] = l
        self._save_user(user, info)

    def load_video(self, item):
        u = self._yt.load(item)

    def get_video(self, link):
        if link.find("youtu") >= 0:
            id = _url_to_name(link)
        else:
            id = link
        return self._yt.get_video_file(id)

    def local_videos(self):
        return dc_to_json(self._yt.list())

    def search(self, query):
        data = self._yt.search(query)
        data.prepare_ids()
        return dc_to_json(data)

    def get_image(self, url):
        return self._yt.load_image(url)

    def get_user_info(self, user):
        info = self._load_user(user)
        return {
                "name": user,
                "lang": info.get("lang", "en"),
                "feeds": info["feeds"],
        }

