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

## Development
To start python server you need to:
1. Init venv for python `# python3 -m venv venv`
2. Load venv: `# . ./venv/bin/activate`
3. Create at least one user with password in ./workdir
4. Run server: python -m ytod

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
