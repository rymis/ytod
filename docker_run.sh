#!/bin/sh

TOP="$(cd $(dirname "$0"); pwd)"

docker build -t ytod .
mkdir -p workdir

docker run --rm -t -i -p 8000:8000 -v "$TOP/workdir:/data/" ytod
