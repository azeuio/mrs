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

    ## Searh for releases of an artist
    # get artist
    res = api.Search().entity("artist").query("stromae").limit(1).execute().artists[0]
    # get linked releases
    res = api.Browse().entity("release").artist(res.id).limit(10).execute()
    # get their titles
    res = list(map(lambda x: x.title, res.releases))

    print(res)
