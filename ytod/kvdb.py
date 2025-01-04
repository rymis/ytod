#!/usr/bin/env python3

import json
import base64
import gzip
import os
import hashlib
import random
import dbm
import pickle


def store_json(filename, data):
    " Atomically store JSON data in file "
    tmpname = filename + f".tmp-{random.randrange(1000000)}"
    with open(tmpname, "wt", encoding="utf-8") as out:
        json.dump(data, out)
    os.rename(tmpname, filename)


def hash_string(s):
    return hashlib.sha224(s.encode('utf-8')).hexdigest()


class KVDB:
    def __init__(self, path):
        self._path = os.path.abspath(path)
        self._db = dbm.open(self._path, "c")

    def __getitem__(self, name):
        if name is str:
            name = name.encode('utf-8')
        return pickle.loads(self._db[name])

    def get(self, name, default = None):
        try:
            return self[name]
        except Exception as e:
            return default

    def __setitem__(self, name, value):
        if name is str:
            name = name.encode('utf-8')
        self._db[name] = pickle.dumps(value)

    def __iter__(self):
        for k in self._db.keys():
            yield k.decode('utf-8')

    def items(self):
        for k in self._db.keys():
            yield k.decode('utf-8'), pickle.loads(self._db[k])

