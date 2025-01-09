#!/usr/bin/env python3

"""
Download videos from YouTube. The easy way.
"""

import urllib
import urllib.request
import os
import sys
import time
import multiprocessing as mp
import logging
import subprocess as sp
import json
from . import feed
from . import kvdb

log = logging.getLogger("youtube");

UPDATE_URL = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp"
TTL = 86400 * 3 # 3 days
VIDEO_TTL = 86400 * 30 # 30 days

def _update_ytdl(cache_dir):
    mod = os.path.join(cache_dir, "yt_dlp.zip")
    need_update = True
    try:
        s = os.stat(mod)
        need_update = time.time() - s.st_ctime > TTL
    except Exception as err:
        print("WARNING:", err)

    if need_update:
        with open(mod + ".tmp", "wb") as dst:
            with urllib.request.urlopen(UPDATE_URL) as src:
                while True:
                    buf = src.read(65536)
                    if not buf:
                        break
                    dst.write(buf)

        os.rename(mod + ".tmp", mod)


def load_video(workdir, url, output, tmp, proxy):
    if os.path.exists(output):
        return
    _update_ytdl(workdir)
    try:
        # TODO: clean tmp directory
        if os.path.exists(tmp):
            os.unlink(tmp)
        cmd = [sys.executable, "-P", os.path.join(workdir, "yt_dlp.zip")]
        if proxy:
            cmd.extend(["--proxy", proxy])
        cmd.extend(["--no-playlist", "-f", "mp4[height<=?480][vcodec!=none][acodec!=none]", "--format-sort", "+res,+quality", "-o", tmp, url])
        sp.check_call(cmd)
        os.rename(tmp, output)
    except Exception as exc:
        log.error(f"Can't load video: {exc}")


class YouTubeDl:
    def __init__(self, workdir):
        self._workdir = workdir
        self._tmpdir = os.path.join(self._workdir, "tmp")
        self._videodir = os.path.join(self._workdir, "video")
        self._tbdir = os.path.join(self._workdir, "thumbnails")
        self._archivepath = os.path.join(self._workdir, "archive.db")
        os.makedirs(self._tmpdir, exist_ok=True)
        os.makedirs(self._videodir, exist_ok=True)
        os.makedirs(self._tbdir, exist_ok=True)
        self._archive = kvdb.KVDB(self._archivepath)
        self._pool = mp.Pool(1)
        self.proxy = None

    def load(self, item: feed.Item):
        " Schedule video for load "
        output = kvdb.hash_string(item.link)
        nm = output + ".mp4"
        self._archive[output] = item
        res = self._pool.apply_async(load_video, args = [ self._workdir, item.link, os.path.join(self._videodir, nm), os.path.join(self._tmpdir, nm), self.proxy ])

    def list(self):
        " List all downloaded videos "
        res = []
        for k, item in self._archive.items():
            if self.has_video(k):
                item.watch = k
            else:
                continue
            res.append(item)
        return res

    def has_video(self, name):
        " Check if video exists "
        return os.path.exists(os.path.join(self._videodir, name + ".mp4"))

    def get_video_file(self, name):
        " get filename for the video "
        return os.path.join(self._videodir, name + ".mp4")

    def remove_video(self, name):
        " Remove video by sha256 name "
        nm = os.path.join(self._videodir, name + ".mp4")
        if os.path.exists(nm):
            os.unlink(nm)

    def search(self, query):
        _update_ytdl(self._workdir)
        cmd = [sys.executable, "-P", os.path.join(self._workdir, "yt_dlp.zip")]
        if self.proxy:
            cmd.extend(["--proxy", proxy])
        cmd.extend(["--dump-json",
            "--default-search", "ytsearch",
            "--no-playlist", "--no-check-certificate", "--geo-bypass",
            "--flat-playlist", "--skip-download", "--quiet", "--ignore-errors", f"ytsearch10:{query}"])
        p = sp.Popen(cmd, stdout = sp.PIPE)
        out = p.communicate()[0].decode('utf-8').split("\n")
        data = []
        for line in out:
            try:
                data.append(json.loads(line))
            except:
                pass

        res = feed.Feed()
        res.title = f"Search: {query}"
        for entry in data:
            e = feed.Item()
            e.channel = entry["channel"]
            e.channel_id = entry["channel_id"]
            e.title = entry.get("title", "Untitled")
            e.link = entry["webpage_url"]
            e.author = entry.get("uploader", "")
            e.is_youtube = True
            watch_id = kvdb.hash_string(e.link)
            if self.has_video(watch_id):
                e.watch = watch_id
            e.time = time.time()
            tbs = entry.get('thumbnails', [])
            if len(tbs) > 0:
                e.thumbnail = feed.Thumbnail()
                e.thumbnail.url = tbs[0]['url']
                e.thumbnail.width = tbs[0].get('width', "320")
                e.thumbnail.height = tbs[0].get('height', "320")
            res.items.append(e)

        return res


    def load_image(self, url):
        " Load image into cache and return filepath of the file "
        name = kvdb.hash_string(url) + ".jpg"
        path = os.path.join(self._tbdir, name)
        if os.path.exists(path):
            return path
        with urllib.request.urlopen(url) as f:
            data = f.read()
        with open(path, "wb") as out:
            out.write(data)
        return path


    def cleanup(self, ttl_days = 30):
        " Remove old videos and images "
        log.info("Cleaning up old videos/images")
        rubicon = time.time() - ttl_days * 86400
        self._clean_dir(self._videodir, rubicon)
        self._clean_dir(self._tbdir, rubicon)


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


if __name__ == '__main__':
    _update_ytdl(".")
