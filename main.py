#!/usr/bin/env python3

import api

if __name__ == "__main__":
    # res = api.search("artist", "Nirvana", limit=1)

    # res = api.Search().entity("artist").query("bach").limit(1).execute()
    # res = api.Lookup().entity("artist").id(res.id).inc().execute()

    # res = api.Search().entity("genre").limit(1).offset(1000).execute()

    # res = api.Search().entity("area").query("france").limit(1).execute().areas[0]
    # res = list(
    #     map(
    #         lambda x: x.name,
    #         api.Browse()
    #         .entity("artist")
    #         .area(res.id)
    #         .limit(10)
    #         .offset(10000)
    #         .execute()
    #         .artists,
    #     )
    # )

    res = api.Search().entity("recording").query("star wars").limit(1).execute()
    # print(res)
    # res = (
    #     api.Browse()
    #     .entity("collection")
    #     .artist(res.id)
    #     .limit(10)
    #     .execute()
    #     .collections[0]
    # )
    # res = api.Browse().entity("instrument").collection(res.id).limit(1).execute()

    print(res)
