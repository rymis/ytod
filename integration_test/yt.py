#!/usr/bin/env python3

from bottle import route, response, run, request, static_file
from xml.dom import minidom as xml
import time
import hashlib
import io
import gif
import random


def stime(secs):
    tt = time.gmtime(secs)
    return time.strftime("%Y-%m-%dT%H:%M:%S+00:00", tt)


def process_args(doc, node, args):
    for arg in args:
        if isinstance(arg, dict):
            for k, v in arg.items():
                node.setAttribute(k, v)
        elif isinstance(arg, xml.Element):
            node.appendChild(arg)
        elif isinstance(arg, str):
            node.appendChild(doc.createTextNode(arg))
        elif isinstance(arg, list):
            process_args(doc, node, arg)
        else:
            assert False


def format_entry(x, channel, chanTitle, i, item):
    video_id = f"{channel}:{i}"
    published = stime(time.time() - i * 3600)
    title = item
    descr = f"DESCRITION: {title}"
    url = f"http://localhost:18321/watch?v={video_id}"
    thumb = f"http://localhost:18321/thumbnail?v={video_id}"
    chanUrl = f"http://localhost:18321/rss?channel_id={channel}"

    return x("entry",
             x("id", f"yt:video:{video_id}"),
             x("yt:videoId", video_id),
             x("yt:channelId", channel),
             x("title", title),
             x("link", {
                 "rel": "alternate",
                 "href": url,
                 }),
             x("author",
               x("name", chanTitle),
               x("uri", chanUrl)
               ),
             x("published", published),
             x("updated", published),
             x("media:group",
               x("media:title", title),
               x("media:content", {
                   "url": url,
                   "type": "application/x-shockwave-flash",
                   "width": "640",
                   "height": "480",
                   }),
               x("media:thumbnail", {
                   "url": thumb,
                   "width": "320",
                   "height": "200",
                   }),
               x("media:description", descr)
               )
             )


def format_feed(channel, title, items):
    doc = xml.Document()

    def x(tag, *args):
        res = doc.createElement(tag)
        process_args(doc, res, args)
        return res

    href = f"http://localhost:18321/rss/channel_id={channel}"
    selfLink = x("link", {
        "rel": "self",
        "href": href,
    })

    selfId = x("id", f"yt:channel:{channel}")

    entries = [format_entry(x, channel, title, i, item) for i, item in enumerate(items)]

    feed = x("feed", {
            "xmlns:yt": "http://www.youtube.com/xml/schemas/2015",
            "xmlns:media": "http://search.yahoo.com/mrss/",
            "xmlns": "http://www.w3.org/2005/Atom",
        },
        selfLink,
        x("id", f"yt:channel:{channel}"),
        x("yt:channelId", channel),
        x("title", title),
        x("link", {
            "rel": "alternate",
            "href": href,
        }),
        x("author",
            x("name", title),
            x("uri", href),
        ),
        x("published", stime(time.time())),

        selfId,

        entries
    )
    
    doc.appendChild(feed)

    return doc.toprettyxml()


def str_to_gif(s):
    out = io.BytesIO()
    img = gif.Writer(out)
    img.write_header()
    img.write_screen_descriptor(64, 64, has_color_table = True, depth = 4)
    img.write_color_table([(20 + i * 8, 20 + i * 8, 20 + i * 8) for i in range(16)], 4)
    img.write_image(64, 64, 4, [ random.randrange(16) for _ in range(64 * 64) ])
    img.write_trailer()

    return out.getvalue()


@route('/rss')
def rss():
    chan_id = request.query.channel_id
    data = format_feed(chan_id, f"Channel {chan_id}", [ f"video-{i}" for i in range(10) ])
    response.content_type = "application/xml"
    return data


@route('/thumbnail')
def thumbnail():
    id = request.query.v
    data = str_to_gif(id)
    response.content_type = "image/gif"
    return data


@route('/watch')
def watch():
    return static_file("countdown.mp4", root=os.path.dirname(__file__))


if __name__ == '__main__':
    run(host='localhost', port=18321, debug=True)

