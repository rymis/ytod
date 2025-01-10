#!/usr/bin/env python3

import sqlite3
import logging
import pickle
import base64
import threading

log = logging.getLogger("db")


def _encode(item):
    return base64.b64encode(pickle.dumps(item)).decode('utf-8')


def _decode(item):
    return pickle.loads(base64.b64decode(item.encode('utf-8')))


class DB:
    def __init__(self, filename):
        self._conn = sqlite3.connect(filename, check_same_thread=False)
        self._lock = threading.Lock()
        self._init_db()

    def _init_db(self):
        cur = self._conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS kv (domain TEXT, key TEXT, value TEXT);')
        cur.execute('CREATE UNIQUE INDEX IF NOT EXISTS kv_domain_key ON kv (domain, key);')
        cur.execute('CREATE TABLE IF NOT EXISTS queue (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT);')
        cur.close()

    def close(self):
        self._conn.close()

    def kv_set(self, domain, key, value):
        with self._lock:
            cur = self._conn.cursor()
            cur.execute("BEGIN;")
            cur.execute("INSERT INTO kv (domain, key, value) VALUES (?, ?, ?) ON CONFLICT (domain, key) DO UPDATE SET value = excluded.value;", (domain, key, _encode(value)))
            cur.execute("COMMIT;")
            cur.close()

    def kv_get(self, domain, key):
        with self._lock:
            cur = self._conn.cursor()
            for val in cur.execute("SELECT value FROM kv WHERE domain = ? AND key = ?;", (domain, key)).fetchall():
                return _decode(val[0])
            return None

    def kv_del(self, domain, key):
        with self._lock:
            cur = self._conn.cursor()
            cur.execute("BEGIN;")
            cur.execute("DELETE FROM kv WHERE domain = ? AND key = ?;", (domain, key))
            cur.execute("COMMIT;")

    def kv_items(self, domain):
        with self._lock:
            cur = self._conn.cursor()
            for key, val in cur.execute("SELECT key, value FROM kv WHERE domain = ?;", (domain,)).fetchall():
                yield key, _decode(val)

    def queue_push(self, value):
        with self._lock:
            cur = self._conn.cursor()
            cur.execute("BEGIN;")
            cur.execute("INSERT INTO queue (item) VALUES (?)", (_encode(value),))
            cur.execute("COMMIT;")

    def queue_pop(self):
        with self._lock:
            cur = self._conn.cursor()
            res = None
            rm = None
            for qid, val in cur.execute("SELECT id, item FROM queue ORDER BY id LIMIT 1;").fetchall():
                res = _decode(val)
                rm = qid
            if rm is not None:
                cur.execute("BEGIN;")
                cur.execute("DELETE FROM queue WHERE id = ?;", (rm,))
                cur.execute("COMMIT;")
            return res

    def queue_items(self):
        with self._lock:
            cur = self._conn.cursor()
            for _, val in cur.execute("SELECT id, item FROM queue ORDER BY id;").fetchall():
                yield _decode(val)


if __name__ == '__main__':
    import os
    import sys

    if len(sys.argv) < 3:
        print("Usage: %s path_to_workdir user [password]" % sys.argv[0])
        sys.exit(1)

    user = sys.argv[2]
    pw = sys.argv[3] if len(sys.argv) >= 4 else None
    db = DB(os.path.join(sys.argv[1], "data.db"))
    db.kv_set("users", user, {
        "password": pw,
        "feeds": [],
    })

