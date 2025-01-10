#!/usr/bin/env python3

"""
Download videos from YouTube. The easy way.
"""

import urllib
import urllib.request
import os
import sys
import time
import random
import multiprocessing as mp
import logging
import subprocess as sp
import json
from . import feed

log = logging.getLogger("youtube")

UPDATE_URL = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp"
TTL = 86400 * 3         # 3 days
VIDEO_TTL = 86400 * 30  # 30 days


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


def load_video(workdir, item: feed.Item, proxy = None):
    output = os.path.join(workdir, "video", item.watch + ".mp4")
    tmp = os.path.join(workdir, "tmp", item.watch + ".mp4")
    os.makedirs(os.path.join(workdir, "video"), exist_ok=True)
    os.makedirs(os.path.join(workdir, "tmp"), exist_ok=True)
    url = item.link

    if os.path.exists(output):
        return

    _update_ytdl(workdir)

    err = []
    for i in range(2):
        try:
            # TODO: clean tmp directory
            if os.path.exists(tmp):
                os.unlink(tmp)
            cmd = [sys.executable, "-P", os.path.join(workdir, "yt_dlp.zip")]
            if proxy:
                cmd.extend(["--proxy", proxy])
            cmd.extend([
                "--no-playlist",
                "-f", "mp4[height<=?480][vcodec!=none][acodec!=none]"])
            if i == 0:
                cmd.extend(["--format-sort", "+res,+quality"])
            cmd.extend(["-o", tmp, url])
            res = sp.run(cmd, stderr=sp.PIPE)
            if res.returncode == 0:
                os.rename(tmp, output)
                return None
            err.append(res.stderr.decode('utf-8', 'replace'))
        except Exception as exc:
            err.append(f"Exception: {exc}")
            log.error(f"Can't load video: {exc}")

    return "Error: " + "\n".join(err)


def search(workdir, query, proxy):
    " Search video on youtube "
    _update_ytdl(workdir)

    cmd = [sys.executable, "-P", os.path.join(workdir, "yt_dlp.zip")]
    if proxy:
        cmd.extend(["--proxy", proxy])
    cmd.extend(["--dump-json",
                "--default-search", "ytsearch",
                "--no-playlist", "--no-check-certificate",
                "--geo-bypass", "--flat-playlist",
                "--skip-download", "--quiet",
                "--ignore-errors", f"ytsearch10:{query}"])
    p = sp.Popen(cmd, stdout=sp.PIPE)
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
        e.time = time.time()
        tbs = entry.get('thumbnails', [])
        if len(tbs) > 0:
            e.thumbnail = feed.Thumbnail()
            e.thumbnail.url = tbs[0]['url']
            e.thumbnail.width = tbs[0].get('width', "320")
            e.thumbnail.height = tbs[0].get('height', "320")
        res.items.append(e)

    return res


