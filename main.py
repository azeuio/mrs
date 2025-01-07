#!/usr/bin/env python3

import api

if __name__ == "__main__":
    # res = api.search("artist", "Nirvana", limit=1)

    res = api.Search().entity("artist").query("bach").limit(1).execute()
    res = api.Lookup().entity("artist").id(res.id).inc().execute()

    # res = api.Search().entity("genre").limit(1).offset(1000).execute()

    # res = api.search("genre", "rock", limit=3)
    # res = api.Search().entity("genre").query("rock").limit(3)()
    # print(api.get_genres(10000))
    print(res)
