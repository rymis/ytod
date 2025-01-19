YourTelevision OnDemand
================
[![Docker Image CI](https://github.com/rymis/ytod/actions/workflows/docker-test-image.yml/badge.svg)](https://github.com/rymis/ytod/actions/workflows/docker-test-image.yml)

The way to watch YouTube videos from Russia and other depressive and repressive countries without limitations.

## Directory structure
Cache directory contains all needed information for the application. It has:
* video - contains downloaded videos
* data.db - SQLite database with all needed information

### User record
It is highly recommended to use external authentication. But if you want to use internal one, you can add user using command:
```
python3 -m ytod.db <path-to-workdir> user password
```

## Use from Docker
Dockerfile is present here. For real deployment I recommend using of some reverse proxy. I use Caddy and it works perfectly. If you want to use this application on VPS you'll probably need to use warp proxy (or some VPN service).

So, my Docker Swarm deployment looks like:

```yaml
services:
  ytod:
    image: "registry.example.net/ytod:latest"
    environment:
      YTOD_EXTERNAL_AUTH: "yes"
      YTOD_PROXY: "socks5://warp:1080"
      YTOD_VIDEO_SIZE: 2000
      YTOD_THUMBNAIL_SIZE: 100
    volumes:
      - "/data/ytod:/data"
    depends_on:
      - warp
  warp:
    image: ghcr.io/kingcc/warproxy:latest
    restart: always
  socat:
    image: alpine/socat
    command: "UNIX-LISTEN:/sockets/ytod,fork,mode=777 TCP:ytod:8000"
    volumes:
      - "/data/sockets:/sockets"
    depends_on:
      - ytod
```

And Caddy forwards connections to UNIX socket:
```
ytod.example.net {
        reverse_proxy * unix//data/sockets/ytod

        basic_auth * {
                # caddy hash-password to prepare password:
                user $2a$14$...
        }
}
```

Be careful: Docker Swarm exposes ports to `0.0.0.0` and creates new firewall rules, so if you try to do it without socat you need to start Docker Swarm in VNET or you'll open free SOCKS5 proxy for the Internet.

## Development
To start python server you need to:
1. Init venv for python `# python3 -m venv venv`
2. Load venv: `# . ./venv/bin/activate`
3. Create at least one user with password in ./workdir
4. Run server: python -m ytod

Web sources are placed in `wwwsrc` directory. To update actual page in `ytod/wwwroot` directory you can use:
```
cd wwwsrc
make install
```

Watch mode is also available, just run `make dev`.

## API

### Feeds
```
GET /ytod/api/feeds

{
    "id1": {
        "title": "Title",
        "items": [

        ]
    }
}
```

### Search
```
GET /ytod/api/search?q=query

{
    "title": "Search results",
    "items": [

    ]
}
```

### Download
TODO...
