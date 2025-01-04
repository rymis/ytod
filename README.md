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
