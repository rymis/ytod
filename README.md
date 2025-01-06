YouTube OnDemand
================

The way to watch YouTube videos from Russia and other depressive countries without limitations.

## Directory structure
Cache directory contains all needed information for the application. It has:
* users - contains information about users
* video - contains downloaded videos
* feeds.db - KV database with all known feeds
* archive.db - Information about downloaded videos

### User record
User information is written in form of JSON file with following structure:
```json
{
    "password": "12345678",
    "feeds": [ "a", "b", "c" ],
}
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
