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


PROCS = []
ROOT = os.path.dirname(__file__)
WORKDIR = os.path.join(tempfile.gettempdir(), f"workdir-{int(time.time() * 1000)}-{random.randrange(1000000)}")


def close_all():
    for p in PROCS:
        try:
            x = p.poll()
            if x is None:
                p.kill()
                p.wait()
        except:
            print("Can not kill process: {p.pid}")
    shutil.rmtree(WORKDIR, ignore_errors=True)


def main():
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

    print("WAITING...")
    p.wait()


if __name__ == '__main__':
    main()
