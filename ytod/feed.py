#!/usr/bin/env python3

import urllib
import os
import json
import logging
import feedparser
import time
import dateutil.parser
from dataclasses import dataclass
import dataclasses
import typing
import threading
from . import kvdb
import hashlib
import base64


log = logging.getLogger("rss")

"""
RSS client here:
https://www.youtube.com/feeds/videos.xml?channel_id=THE_CHANNEL_ID_HERE
"""
YOUTUBE_URL = "https://www.youtube.com/feeds/videos.xml?channel_id="

@dataclass
class Thumbnail:
    url: str = ""
    width: str = ""
    height: str = ""

@dataclass
class Item:
    link: str = ""
    watch: str = ""
    title: str = ""
    description: str = ""
    author: str = ""
    thumbnail: typing.Optional[Thumbnail] = None
    time: float = 0.0
    is_youtube: bool = False
    video_id: str = ""
    channel: str = ""
    channel_id: str = ""

    def encode(self):
        " Encode item information for downloading. Result is base32 of JSON. "
        id = {
            "link": self.link,
            "title": self.title,
            "channel_id": self.channel_id,
            "channel": self.channel,
            "time": self.time,
        }
        if self.thumbnail:
            id["thumbnail_url"] = self.thumbnail.url
            id["thumbnail_width"] = self.thumbnail.width
            id["thumbnail_height"] = self.thumbnail.height

        return base64.b64encode(json.dumps(id).encode('utf-8')).decode('utf-8')

    def decode(self, val):
        " Decode item from value encoded by encode method. "
        j = json.loads(base64.b64decode(val).decode('utf-8'))
        self.link = j["link"]
        self.title = j["title"]
        self.time = j["time"]
        self.channel = j["channel"]
        self.channel_id = j["channel_id"]
        if "thumbnail_url" in j:
            self.thumbnail = Thumbnail(url=j["thumbnail_url"])
            self.thumbnail.width = j.get("thumbnail_width", "")
            self.thumbnail.height = j.get("thumbnail_height", "")

@dataclass
class Feed:
    title: str = ""
    items: typing.List[Item] = dataclasses.field(default_factory=lambda:[])

    def prepare_ids(self):
        " Prepare video-ids for use in download methods "
        for item in self.items:
            item.video_id = item.encode()
            if item.thumbnail:
                item.thumbnail.url = "/ytod/api/image?url=" + urllib.parse.quote_plus(item.thumbnail.url)

class FeedLoader:
    def __init__(self, path):
        self._path = path
        self._feeds = []
        self._load_feeds()
        self._db = kvdb.KVDB(os.path.join(self._path, "feeds.db"))
        self._lock = False

    def _load_feeds(self):
        " Load feeds from users "
        feeds = set()
        for user_json in os.listdir(os.path.join(self._path, "users")):
            if not user_json.endswith(".json"):
                continue
            fnm = os.path.join(self._path, "users", user_json)
            try:
                with open(fnm, "rt", encoding="utf-8") as f:
                    info = json.load(f)
                    for c in info.get("feeds", []):
                        feeds.add(c)
            except:
                pass
        feeds = list(feeds)
        feeds.sort()
        self._feeds = feeds

    def update_feeds(self):
        " Update all feeds "
        if self._lock:
            return
        try:
            log.info("Updating feeds...")
            self._lock = True
            for feed in self._feeds:
                self._update_feed(feed)
            log.info("All feeds have been updated.")
        finally:
            self._lock = False


    def list_feeds(self):
        " List downloaded feeds "
        return list(self._db)


    def load_feed(self, feed):
        " Load everything from a feed "
        data = self._db.get(feed, None)
        if data is None:
            self._update_feed(feed)
            data = self._db.get(feed)
        return data


    def _update_feed(self, feed_id):
        feedname = YOUTUBE_URL + urllib.parse.quote_plus(feed_id)
        log.info(f"Updating {feedname}")
        feed = feedparser.parse(feedname)
        data = self._db.get(feedname, Feed())

        news = { }
        for item in data.items:
            news[item.link] = item

        # TODO: Filter old posts
        data.title = feed["feed"]["title"]
        for n in feed["entries"]:
            item = Item()
            item.link = n["link"]
            item.title = n.get("title", "Untitled")
            item.description = n.get("summary", "")
            item.author = n.get("author", "Unknown")
            item.video_id = n.get("yt_videoid", "")
            item.channel_id = n.get("yt_channelid", "")
            item.channel = data.title

            published = n.get("published", "")
            ptime = time.time()
            if published:
                try:
                    ptime = dateutil.parser.parse(published).timestamp()
                except:
                    pass
            item.time = ptime

            thumbnail = None
            for tb in n.get("media_thumbnail", []):
                if "url" in tb:
                    item.thumbnail = Thumbnail(url=tb.get("url"), width=tb.get("width", "480"), height=tb.get("height", "360"))
                    break

            news[n.link] = item

        news = [ n for _, n in news.items() ]
        news.sort(key = lambda n : -n.time)
        data.items = news
        self._db[feed_id] = data

        #print(json.dumps(data, indent=2))
    def run(self):
        " Run periodic updater "
        self._th = threading.Thread(target = lambda : self._work())
        self._th.start()

    def _work(self):
        while True:
            self.update_feeds()
            time.sleep(1800) # Sleep 30 minutes


if __name__ == '__main__':
    loader = FeedLoader("./workdir")
    loader.update_feeds()
    #load_videos("UCBzDAjLfvBUBVMMP6-K-y0w")

