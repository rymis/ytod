
import argparse
import hashlib
import json
import shutil


def do_search(query):
    q = query.split(':', 1)[-1]
    for i in range(10):
        chan = hashlib.md5(query.encode('utf-8', 'replace')).hexdigest()[:8] + str(i)
        video_id = f"{chan}:{i}"

        item = {
                "_type": "url",
                "ie_key": "YouTube",
                "channel": f"Channel {chan}",
                "channel_id": chan,
                "title": f"{q} {video_id}",
                "webpage_url": f"http://localhost:18321/watch?v={video_id}",
                "author": chan,
                "thumbnails": [
                    {
                        "url": f"http://localhost:18321/thumbnail?v={video_id}",
                        "width": "256",
                        "height": 192,
                    }
                ]
        }
        print(json.dumps(item))


def do_download(output):
    shutil.copy("integration_test/countdown.mp4", output)


def main():
    args = argparse.ArgumentParser(description="Fake yt_dlp module for testing")
    args.add_argument("--proxy", help="HTTP or SOCKS5 proxy")
    args.add_argument("--default-search", help="Default search to use")
    args.add_argument("--no-playlist", action="store_true", help="do not download playlist")
    args.add_argument("--no-check-certificate", action="store_true", help="do not check server certificate")
    args.add_argument("--geo-bypass", action="store_true", help="bypass GEO location")
    args.add_argument("--flat-playlist", action="store_true", help="flat playlist")
    args.add_argument("--skip-download", action="store_true", help="do not download")
    args.add_argument("-f", "--format", help="format")
    args.add_argument("--format-sort", help="format sort")
    args.add_argument("-o", "--output", help="output file")

    args.add_argument("--quiet", action="store_true", help="be quiet")
    args.add_argument("--ignore-errors", action="store_true", help="ignore errors")
    args.add_argument("--dump-json", action="store_true", help="dump json to output")
    args.add_argument("video", help="video to download or search")

    opts = args.parse_args()

    # Now we can determine what is needed:
    if opts.dump_json and opts.video.startswith("ytsearch"):
        do_search(opts.video)
    else:
        do_download(opts.output)

main()

