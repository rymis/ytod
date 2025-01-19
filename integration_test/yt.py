#!/usr/bin/env python3

from bottle import route, response, run, request, static_file
from xml.dom import minidom as xml
import time
import hashlib
import io
import gif
import random


FONT = [
        0x0, 0x7e81a581bd99817e, 0x7effdbffc3e7ff7e, 0x6cfefefe7c381000,
        0x10387cfe7c381000, 0x387c38fefe7c387c, 0x1010387cfe7c387c, 0x183c3c180000,
        0xffffe7c3c3e7ffff, 0x3c664242663c00, 0xffc399bdbd99c3ff, 0xf070f7dcccccc78,
        0x3c6666663c187e18, 0x3f333f303070f0e0, 0x7f637f636367e6c0, 0x995a3ce7e73c5a99,
        0x80e0f8fef8e08000, 0x20e3efe3e0e0200, 0x183c7e18187e3c18, 0x6666666666006600,
        0x7fdbdb7b1b1b1b00, 0x3e63386c6c38cc78, 0x7e7e7e00, 0x183c7e187e3c18ff,
        0x183c7e1818181800, 0x181818187e3c1800, 0x180cfe0c180000, 0x3060fe60300000,
        0xc0c0c0fe0000, 0x2466ff66240000, 0x183c7effff0000, 0xffff7e3c180000,
        0x0, 0x3078783030003000, 0x6c6c6c0000000000, 0x6c6cfe6cfe6c6c00,
        0x307cc0780cf83000, 0xc6cc183066c600, 0x386c3876dccc7600, 0x6060c00000000000,
        0x1830606060301800, 0x6030181818306000, 0x663cff3c660000, 0x3030fc30300000,
        0x303060, 0xfc00000000, 0x303000, 0x60c183060c08000,
        0x7cc6cedef6e67c00, 0x307030303030fc00, 0x78cc0c3860ccfc00, 0x78cc0c380ccc7800,
        0x1c3c6cccfe0c1e00, 0xfcc0f80c0ccc7800, 0x3860c0f8cccc7800, 0xfccc0c1830303000,
        0x78cccc78cccc7800, 0x78cccc7c0c187000, 0x30300000303000, 0x30300000303060,
        0x183060c060301800, 0xfc0000fc0000, 0x6030180c18306000, 0x78cc0c1830003000,
        0x7cc6dededec07800, 0x3078ccccfccccc00, 0xfc66667c6666fc00, 0x3c66c0c0c0663c00,
        0xf86c6666666cf800, 0xfe6268786862fe00, 0xfe6268786860f000, 0x3c66c0c0ce663e00,
        0xccccccfccccccc00, 0x7830303030307800, 0x1e0c0c0ccccc7800, 0xe6666c786c66e600,
        0xf06060606266fe00, 0xc6eefefed6c6c600, 0xc6e6f6decec6c600, 0x386cc6c6c66c3800,
        0xfc66667c6060f000, 0x78ccccccdc781c00, 0xfc66667c6c66e600, 0x78cce0701ccc7800,
        0xfcb4303030307800, 0xccccccccccccfc00, 0xcccccccccc783000, 0xc6c6c6d6feeec600,
        0xc6c66c38386cc600, 0xcccccc7830307800, 0xfec68c183266fe00, 0x7860606060607800,
        0xc06030180c060200, 0x7818181818187800, 0x10386cc600000000, 0xff,
        0x3030180000000000, 0x780c7ccc7600, 0xe060607c6666dc00, 0x78ccc0cc7800,
        0x1c0c0c7ccccc7600, 0x78ccfcc07800, 0x386c60f06060f000, 0x76cccc7c0cf8,
        0xe0606c766666e600, 0x3000703030307800, 0xc000c0c0ccccc78, 0xe060666c786ce600,
        0x7030303030307800, 0xccfefed6c600, 0xf8cccccccc00, 0x78cccccc7800,
        0xdc66667c60f0, 0x76cccc7c0c1e, 0xdc766660f000, 0x7cc0780cf800,
        0x10307c3030341800, 0xcccccccc7600, 0xcccccc783000, 0xc6d6fefe6c00,
        0xc66c386cc600, 0xcccccc7c0cf8, 0xfc983064fc00, 0x1c3030e030301c00,
        0x1818180018181800, 0xe030301c3030e000, 0x76dc000000000000, 0x10386cc6c6fe00,
        0x78ccc0cc78180c78, 0xcc00cccccc7e00, 0x1c0078ccfcc07800, 0x7ec33c063e663f00,
        0xcc00780c7ccc7e00, 0xe000780c7ccc7e00, 0x3030780c7ccc7e00, 0x78c0c0780c38,
        0x7ec33c667e603c00, 0xcc0078ccfcc07800, 0xe00078ccfcc07800, 0xcc00703030307800,
        0x7cc6381818183c00, 0xe000703030307800, 0xc6386cc6fec6c600, 0x30300078ccfccc00,
        0x1c00fc607860fc00, 0x7f0c7fcc7f00, 0x3e6cccfeccccce00, 0x78cc0078cccc7800,
        0xcc0078cccc7800, 0xe00078cccc7800, 0x78cc00cccccc7e00, 0xe000cccccc7e00,
        0xcc00cccc7c0cf8, 0xc3183c66663c1800, 0xcc00cccccccc7800, 0x18187ec0c07e1818,
        0x386c64f060e6fc00, 0xcccc78fc30fc3030, 0xf8ccccfac6cfc6c7, 0xe1b183c1818d870,
        0x1c00780c7ccc7e00, 0x3800703030307800, 0x1c0078cccc7800, 0x1c00cccccc7e00,
        0xf800f8cccccc00, 0xfc00ccecfcdccc00, 0x3c6c6c3e007e0000, 0x386c6c38007c0000,
        0x30003060c0cc7800, 0xfcc0c00000, 0xfc0c0c0000, 0xc3c6ccde3366cc0f,
        0xc3c6ccdb376fcf03, 0x1818001818181800, 0x3366cc66330000, 0xcc663366cc0000,
        0x2288228822882288, 0x55aa55aa55aa55aa, 0xdb77dbeedb77dbee, 0x1818181818181818,
        0x18181818f8181818, 0x1818f818f8181818, 0x36363636f6363636, 0xfe363636,
        0xf818f8181818, 0x3636f606f6363636, 0x3636363636363636, 0xfe06f6363636,
        0x3636f606fe000000, 0x36363636fe000000, 0x1818f818f8000000, 0xf8181818,
        0x181818181f000000, 0x18181818ff000000, 0xff181818, 0x181818181f181818,
        0xff000000, 0x18181818ff181818, 0x18181f181f181818, 0x3636363637363636,
        0x363637303f000000, 0x3f3037363636, 0x3636f700ff000000, 0xff00f7363636,
        0x3636373037363636, 0xff00ff000000, 0x3636f700f7363636, 0x1818ff00ff000000,
        0x36363636ff000000, 0xff00ff181818, 0xff363636, 0x363636363f000000,
        0x18181f181f000000, 0x1f181f181818, 0x3f363636, 0x36363636ff363636,
        0x1818ff18ff181818, 0x18181818f8000000, 0x1f181818, 0xffffffffffffffff,
        0xffffffff, 0xf0f0f0f0f0f0f0f0, 0xf0f0f0f0f0f0f0f, 0xffffffff00000000,
        0x76dcc8dc7600, 0x78ccf8ccf8c0c0, 0xfcccc0c0c0c000, 0xfe6c6c6c6c6c00,
        0xfccc603060ccfc00, 0x7ed8d8d87000, 0x666666667c60c0, 0x76dc1818181800,
        0xfc3078cccc7830fc, 0x386cc6fec66c3800, 0x386cc6c66c6cee00, 0x1c30187ccccc7800,
        0x7edbdb7e0000, 0x60c7edbdb7e60c0, 0x3860c0f8c0603800, 0x78cccccccccccc00,
        0xfc00fc00fc0000, 0x3030fc303000fc00, 0x603018306000fc00, 0x183060301800fc00,
        0xe1b1b1818181818, 0x1818181818d8d870, 0x303000fc00303000, 0x76dc0076dc0000,
        0x386c6c3800000000, 0x1818000000, 0x18000000, 0xf0c0c0cec6c3c1c,
        0x786c6c6c6c000000, 0x7018306078000000, 0x3c3c3c3c0000, 0x0,
]


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
                   "width": "256",
                   "height": "192",
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

    pattern = hashlib.sha256(s.encode('utf-8', 'replace')).hexdigest().encode('cp850', 'replace')
    while len(pattern) < 16:
        pattern = pattern + pattern

    data = [ 0 for i in range(128 * 96) ]
    for i in range(12):
        for j in range(16):
            c = FONT[pattern[j]]
            for k in range(64):
                v = (i + 1) if c & (1 << k) else 0
                y = i * 8 + (7 - k // 8)
                x = j * 8 + (7 - k % 8)
                data[y * 128 + x] = v

    img.write_screen_descriptor(128, 96, has_color_table = True, depth = 4)
    img.write_color_table([
        (0, 0, 0),
        (0, 16 * 14, 0),
        (0, 16 * 13, 0),
        (0, 16 * 12, 0),
        (0, 16 * 11, 0),
        (0, 16 * 10, 0),
        (0, 16 * 9, 0),
        (0, 16 * 8, 0),
        (0, 16 * 7, 0),
        (0, 16 * 6, 0),
        (0, 16 * 5, 0),
        (0, 16 * 4, 0),
        (0, 16 * 3, 0),
        (0, 16 * 2, 0),
        (0, 16, 0),
        (0, 0, 0),
    ], 4)
    img.write_image(128, 96, 4, data)
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

