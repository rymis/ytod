#!/usr/bin/env python3

from bottle import route, run, static_file, redirect, auth_basic, request
import argparse
import os
from . import server
from . import feed
import logging
import json

DEFAULT_WORKDIR = os.path.join(os.path.dirname(__file__), "workdir")
WWWROOT = os.path.join(os.path.dirname(__file__), "wwwroot")

APP = None

def is_authenticated_user(user, password):
    return APP.check_user(user, password)

@route('/ytod/static/<filepath:path>')
@auth_basic(is_authenticated_user)
def server_static(filepath):
    return static_file(filepath, root=WWWROOT)

@route('/')
@auth_basic(is_authenticated_user)
def index():
    redirect("/ytod/static/index.html")

@route('/ytod/api/feeds')
@auth_basic(is_authenticated_user)
def feeds():
    return APP.list_user_feeds(request.auth[0])

@route('/ytod/api/search')
@auth_basic(is_authenticated_user)
def feeds():
    query = request.query.q
    return APP.search(query)

@route('/ytod/api/download', method="POST")
@auth_basic(is_authenticated_user)
def download():
    body = json.load(request.body)
    item = feed.Item()
    item.decode(body["video_id"])
    APP.load_video(item)
    return { "result": "OK" }

@route('/ytod/api/local_videos')
@auth_basic(is_authenticated_user)
def local_video():
    return { "result": APP.local_videos() }

@route('/ytod/api/video/:id')
@auth_basic(is_authenticated_user)
def video(id):
    d, n = os.path.split(APP.get_video(id))
    return static_file(n, root = d)

@route('/ytod/api/image')
@auth_basic(is_authenticated_user)
def image():
    url = request.query.url
    path = APP.get_image(url)
    d, n = os.path.split(path)
    return static_file(n, root = d)

@route('/ytod/api/user_info')
@auth_basic(is_authenticated_user)
def user_info():
    return APP.get_user_info(request.auth[0])

@route('/ytod/api/subscribe')
@auth_basic(is_authenticated_user)
def subscribe():
    return APP.subscribe(request.auth[0], request.query.channel_id)

@route('/ytod/api/unsubscribe')
@auth_basic(is_authenticated_user)
def unsubscribe():
    return APP.unsubscribe(request.auth[0], request.query.channel_id)

def main():
    global APP
    args = argparse.ArgumentParser(description="Run YouTube micro reader")
    args.add_argument("-p", "--port", help="Listen on port", default=12345)
    args.add_argument("-l", "--host", help="Listen on address", default="localhost")
    args.add_argument("-w", "--workdir", help="Work directory", default=DEFAULT_WORKDIR)
    args.add_argument("-t", "--ttl", help="Videos time to live in days", default=30)
    args.add_argument("-d", "--verbose", help="Run in debug mode", action="store_true")
    opts = args.parse_args()

    if True or opts.verbose:
        logging.basicConfig(format='%(asctime)s [%(levelname)s] %(message)s', level=logging.DEBUG, encoding="utf-8")
    else:
        logging.basicConfig(format='%(asctime)s [%(levelname)s] %(message)s', level=logging.INFO)

    os.makedirs(opts.workdir, exist_ok=True)
    APP = server.Server(opts.workdir)
    APP.set_ttl(opts.ttl)

    if True or opts.verbose:
        run(host='localhost', port=opts.port, debug=True)
    else:
        run(server="cheroot", host=opts.host, port=opts.port, debug=False)

main()
