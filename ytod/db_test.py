
from . import db

import unittest
import tempfile
import time
import random
import os
import queue


def random_filename():
    return os.path.join(tempfile.gettempdir(), f"tmp_{int(time.time() * 1000)}_{random.randrange(1000000)}")


def random_string(length=16):
    res = []
    for i in range(length):
        res.append(random.choice("qwertyuiopasdfghjklzxcvbnm1234567890"))
    return "".join(res)


class TmpDB(db.DB):
    def __init__(self):
        self.__tmpfilename = random_filename()
        super().__init__(self.__tmpfilename)

    def __enter__(self):
        return self

    def __exit__(self, type, value, tb):
        self.close()
        os.unlink(self.__tmpfilename)


class DBTest(unittest.TestCase):
    def test_kv_simple(self):
        with TmpDB() as db:
            data = {random_string(8): random_string(16) for i in range(1000)}
            for k, v in data.items():
                db.kv_set("a", k, v)
            for k, v in data.items():
                self.assertEqual(v, db.kv_get("a", k))
            keys = list(data)
            while keys:
                key = keys.pop()
                db.kv_del("a", key)
                for k in keys:
                    self.assertEqual(data[k], db.kv_get("a", k))
                self.assertIsNone(db.kv_get("a", key))

    def test_queue(self):
        with TmpDB() as db:
            etalon = queue.Queue()

            for i in range(100):
                push_cnt = random.randrange(5)
                pop_cnt = random.randrange(7)
                for i in range(push_cnt):
                    item = random_string(16)
                    etalon.put(item)
                    db.queue_put(item)
                for i in range(pop_cnt):
                    val = db.queue_get()
                    if etalon.empty():
                        self.assertIsNone(val)
                    else:
                        self.assertEqual(val, etalon.get())
