#!/usr/bin/env python3

import subprocess as sp
import os
import atexit
import sys
import time
import random
import tempfile
import shutil
import zipfile
import requests
import signal


PROCS = []
ROOT = os.path.dirname(__file__)
WORKDIR = os.path.join(tempfile.gettempdir(), f"workdir-{int(time.time() * 1000)}-{random.randrange(1000000)}")


def close_all():
    for p in PROCS:
        try:
            x = p.poll()
            if x is None:
                p.send_signal(signal.SIGTERM)
                p.wait()
        except:
            print("Can not kill process: {p.pid}")
    shutil.rmtree(WORKDIR, ignore_errors=True)


def run_stack():
    os.putenv("YTOD_OVERRIDE_YOUTUBE_URL", "http://localhost:18321/rss?channel_id=")
    atexit.register(close_all)

    print("Prepare workdir...")
    os.makedirs(WORKDIR)
    sp.check_call([sys.executable, "-m", "ytod.db", WORKDIR, "test", "12345678"], cwd=os.path.join(ROOT, ".."))
    z = zipfile.ZipFile(os.path.join(WORKDIR, "yt_dlp.zip"), "w")
    for fnm in os.listdir(os.path.join(ROOT, "yt_dlp")):
        if fnm.endswith(".py"):
            z.write(os.path.join(ROOT, "yt_dlp", fnm), fnm)
    z.close()

    print("Starting fake youtube server...")
    p = sp.Popen([sys.executable, os.path.join(ROOT, "yt.py")])
    PROCS.append(p)

    print("Starting ytod...")
    p = sp.Popen([sys.executable, "-m", "ytod", "-d", "-w", WORKDIR], cwd=os.path.join(ROOT, ".."))
    PROCS.append(p)

    return p


def test_auth():
    data = requests.get("http://localhost:12345/ytod/api/user_info", auth=requests.auth.HTTPBasicAuth("test", "12345678")).json()
    assert data["name"] == "test"

    # Check incorrect auth:
    resp = requests.get("http://localhost:12345/ytod/api/user_info", auth=requests.auth.HTTPBasicAuth("test", "12345687"))
    assert not resp.ok

    resp = requests.get("http://localhost:12345/ytod/api/user_info", auth=requests.auth.HTTPBasicAuth("user", "12345678"))
    assert not resp.ok

    resp = requests.get("http://localhost:12345/ytod/api/user_info", headers={"Remote-User": "user"})
    assert not resp.ok


def GET(method, params=None):
    return requests.get(f"http://localhost:12345/ytod/api/{method}", params=params, auth=requests.auth.HTTPBasicAuth("test", "12345678"))


def POST(method, data):
    return requests.post(f"http://localhost:12345/ytod/api/{method}", json=data, auth=requests.auth.HTTPBasicAuth("test", "12345678"))


def run_test():
    test_auth()
    # Operation:
    info = GET("user_info").json()
    assert len(info["feeds"]) == 0

    # Search for videos:
    srch = GET("search", {"q": "search query"}).json()
    channels = []

    for v in srch["items"]:
        channels.append(v["channel_id"])

    GET("subscribe", {"channel_id": channels[0]})
    GET("subscribe", {"channel_id": channels[1]})

    # And now we want to check subscriptions:
    feeds = GET("feeds").json()
    assert channels[0] in feeds
    assert channels[1] in feeds

    videos = []
    for _, feed in feeds.items():
        for v in feed["items"]:
            videos.append(v)

    # Download one video:
    assert POST("download", {"video_id":videos[0]["video_id"]}).ok

    for i in range(100):
        print("Waiting for the video...")
        if len(GET("local_videos").json()["result"]) > 0:
            break
        time.sleep(5)

    # Check video in archive
    archive = GET("local_videos").json()["result"]
    assert len(archive) == 1
    assert archive[0]["link"] == videos[0]["link"]
    assert archive[0]["watch"]
    assert GET("image", {"url": archive[0]["thumbnail"]["url"]}).ok

    # Remove video:
    assert GET("remove", {"video_id": archive[0]["watch"]})
    archive = GET("local_videos").json()["result"]
    assert len(archive) == 0

    # Check unsubscribe:
    GET("unsubscribe", {"channel_id": channels[0]})
    feeds = GET("feeds").json()
    assert channels[0] not in feeds
    assert channels[1] in feeds


def main():
    p = run_stack()

    if len(sys.argv) > 1 and sys.argv[1] == 'test':
        time.sleep(2)
        res = 0
        try:
            run_test()
        except:
            res = 1
        p.send_signal(signal.SIGTERM)
        time.sleep(1)
        p.wait()
        print(f"Test result: {res}")
        sys.exit(res)
    else:
        print("WAITING...")
        p.wait()


if __name__ == '__main__':
    main()
