#!/usr/bin/env python3

import os
import json


def process_strings(filename):
    with open(filename, "rt", encoding="utf-8") as f:
        data = json.load(f)
    res = { }
    for k, v in data.items():
        translate = v[1]
        if translate:
            res[k] = translate
    return res


def main():
    root = os.path.dirname(__file__)
    res = { }
    for fnm in os.listdir(root):
        if fnm.endswith(".json"):
            lang = fnm.rsplit('.', 2)[-2]
            res[lang] = process_strings(os.path.join(root, fnm))
    with open(os.path.join(root, "..", "src", "messages.js"), "wt", encoding="utf-8") as out:
        out.write("export const messages = ")
        json.dump(res, out, indent=2)
        out.write(";\n")
    print("File messages.js is prepared")


if __name__ == '__main__':
    main()

