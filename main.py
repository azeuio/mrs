#!/usr/bin/env python3

import api

if __name__ == "__main__":
    res = api.search("artist", "Nirvana", limit=1)
    print(res)
