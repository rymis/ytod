FROM alpine:3.21

RUN apk add python3 ffmpeg py3-pip python3-gdbm

RUN adduser -D ytod
RUN mkdir /ytod
WORKDIR /ytod

RUN mkdir -p /data/workdir
RUN chown ytod:ytod /data/workdir

COPY requirements.txt requirements.txt

RUN chown -R ytod:ytod /ytod

RUN python -m venv venv
RUN ./venv/bin/pip install -r requirements.txt

COPY ytod ytod

ENTRYPOINT [ "./venv/bin/python", "-m", "ytod", "-l", "0.0.0.0", "-p", "8000", "-w", "/data/workdir" ]
# ENTRYPOINT [ "/bin/sh" ]

