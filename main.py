from typing import List
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import api
from mongoengine import (
    Document,
    StringField,
    DateTimeField,
    ReferenceField,
    IntField,
    connect,
)
from datetime import datetime, timezone
from flask_cors import CORS

from api.types import Artist, Tag


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config["CORS_HEADERS"] = "Content-Type"

# mongo_uri = "mongodb+srv://lucas:lucasmrs@cluster0.mwrx5.mongodb.net/flaskdb?retryWrites=true&w=majority"
mongo_uri = "mongodb+srv://lucas:lucasmrs@cluster0.iea0zmj.mongodb.net/flaskdb?retryWrites=true&w=majority"
connect("flaskdb", host=mongo_uri)

users = {}


class User(Document):
    username = StringField(required=True, unique=True)
    password = StringField(required=True)


class Song(Document):
    title = StringField(required=True, unique=True)
    artist = StringField()
    album = StringField()
    release_date = DateTimeField()


class UserSongPlay(Document):
    username = StringField(required=True)
    song = ReferenceField(Song, required=True)
    play_count = IntField(default=1)
    last_played = DateTimeField(
        default=datetime.now(timezone.utc)
    )  # Fix with timezone-aware datetime


# Routes
@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Flask MongoDB API for song plays!"})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("email")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required!"}), 400

    # user = User.objects(username=username, password=password).first()
    if username not in users:
        return jsonify({"error": "Invalid username or password!"}), 401
    if users[username] != password:
        return jsonify({"error": "Invalid username or password!"}), 401
    return jsonify({"message": "Login successful!"}), 200


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("email")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required!"}), 400

    # user = User(username=username, password=password)
    # user.save()
    if username in users:
        return jsonify({"error": "Username already exists!"}), 400
    users[username] = password

    return jsonify({"message": "User created successfully!"}), 201


@app.route("/play", methods=["POST"])
def add_or_update_play():
    data = request.get_json()

    song_title = data.get("title")
    username = data.get("username")

    if not song_title or not username:
        return jsonify({"error": "Title and username are required!"}), 400

    song = Song.objects(title=song_title).first()

    if song:

        user_song_play = UserSongPlay.objects(username=username, song=song).first()

        if user_song_play:
            user_song_play.update(
                inc__play_count=1, set__last_played=datetime.now(timezone.utc)
            )
            return jsonify({"message": "Song play count updated!"}), 200
        else:
            UserSongPlay(
                username=username,
                song=song,
                play_count=1,
                last_played=datetime.now(timezone.utc),
            ).save()
            return jsonify({"message": "Song play recorded for the first time!"}), 201
    else:
        song = Song(
            title=song_title,
            artist=data.get("artist", ""),
            album=data.get("album", ""),
            release_date=datetime.now(timezone.utc),
        )
        song.save()

        UserSongPlay(
            username=username,
            song=song,
            play_count=1,
            last_played=datetime.now(timezone.utc),
        ).save()
        return jsonify({"message": "New song created and play recorded!"}), 201


@app.route("/least_played", methods=["GET"])
def least_played_songs():
    aggregation = UserSongPlay.objects.aggregate(
        [
            {"$group": {"_id": "$song", "total_plays": {"$sum": "$play_count"}}},
            {"$sort": {"total_plays": 1}},
            {"$limit": 10},
        ]
    )

    least_played = []
    for entry in aggregation:
        song = Song.objects(id=entry["_id"]).first()
        if song:
            least_played.append(
                {
                    "title": song.title,
                    "artist": song.artist,
                    "album": song.album,
                    "release_date": song.release_date,
                    "total_plays": entry["total_plays"],
                }
            )

    return jsonify({"least_played_songs": least_played}), 200


@app.get("/api/search")
def search():
    query = request.args.get("q")
    limit = request.args.get("limit", 10)
    offset = request.args.get("offset", 0)
    inc = request.args.get("inc")
    type: api.types.ENTITY_TYPING = request.args.get("type", "artist")
    res = (
        api.Search()
        .entity(type)
        .query(query)
        .limit(limit)
        .inc(inc)
        .offset(offset)
        .execute_json()
    )
    return jsonify(res)


@app.get("/api/lookup")
def lookup():
    offset = request.args.get("offset", 0)
    type: api.types.ENTITY_TYPING = request.args.get("type", "artist")
    id = request.args.get("id")
    inc = request.args.get("inc")
    res = api.Lookup().entity(type).id(id)
    if inc:
        res.inc(inc)
    res = res.execute_json()
    return jsonify(res)


@app.get("/api/browse_releases")
def browse_releases():
    offset = request.args.get("offset", 0)
    limit = request.args.get("limit", 10)
    artist_id = request.args.get("artist")
    res = (
        api.Browse()
        .entity("release")
        .artist(artist_id)
        .limit(limit)
        .offset(offset)
        .execute_json()
    )
    return jsonify(res)


@app.get("/api/release/<id>/front")
def release_front(id):
    url = f"https://coverartarchive.org/release/{id}/front"
    res = requests.get(url)
    res.raise_for_status()
    return jsonify(res.json())


@app.get("/api/genre/related/<id>")
def related_genre(id):
    res = api.Lookup().entity("artist").id(id).inc("genre-rels").execute_json()
    return jsonify(res)


@app.get("/api/artist/<id>/genres")
def artist_genres(id):
    res = api.Lookup().entity("artist").id(id).inc("genres").execute_json()
    tags: List[Tag] = res.get("genres", [])

    return jsonify(
        {"name": tag["name"], "id": tag["id"]}
        for tag in sorted(tags, key=lambda x: x["count"], reverse=True)
    )


@app.get("/api/artist/<id>/tags")
def artist_tags(id):
    res = api.Lookup().entity("artist").id(id).inc("tags").execute_json()
    tags: List[Tag] = res.get("tags", [])

    return jsonify(sorted(tags, key=lambda x: x["count"], reverse=True))


@app.get("/api/genres/top/artists")
def top_artists_by_genre():
    genre = request.args.get("genre")
    limit = request.args.get("limit", 10)
    offset = request.args.get("offset", 0)
    res = (
        api.Browse()
        .entity("artist")
        .genre(genre)
        .limit(limit)
        .offset(offset)
        .execute_json()
    )
    return jsonify(res)


@app.get("/api/artist/similar")
def similar_artists_query():
    q = request.args.get("q")
    artist = api.Search().entity("artist").query(q).execute()
    if not artist or len(artist.artists) == 0:
        return jsonify({"error": "Artist not found!"}), 404
    return similar_artists(artist.artists[0].id)


@app.get("/api/artist/<id>/similar")
def similar_artists(id):
    artist = api.Lookup().entity("artist").id(id).inc("tags").execute_json()
    if not artist:
        return jsonify({"error": "Artist not found!"}), 404
    similar: List[Artist] = []
    if artist["tags"] and len(artist["tags"]) > 0 and artist["country"]:
        similar.extend(
            api.Search()
            .entity("artist")
            .tag(artist["tags"][0]["name"])
            .country(artist["country"])
            .type("artist")
            .inc("tags")
            .limit(5)
            .execute()
            .artists
        )
    res = []
    for a in similar:
        res.extend(
            {
                "id": None,
                "title": rel.title,
                "artist": a.name,
                "album": None,
                "release_date": rel.date,
                "duration": None,
                "src": None,
                "image": None,
                "liked": None,
                "listened": None,
                "listening": None,
            }
            for rel in api.Browse()
            .entity("release")
            .artist(a.id)
            .limit(3)
            .execute()
            .releases
        )
    return jsonify(res)


@app.get("/api/artist/search_similar")
def get_similar_artists_from_wikidata():
    artist_name = request.args.get("artist")
    limit = request.args.get("limit", 10)
    print(f"Searching similar artists for {artist_name}")
    query = f"""
    SELECT ?similarArtistLabel WHERE {{
      ?artist rdfs:label "{artist_name.capitalize()}"@en.
      ?artist wdt:P136 ?genre.
      ?similarArtist wdt:P136 ?genre.
      ?similarArtist rdfs:label ?similarArtistLabel.
      FILTER(LANG(?similarArtistLabel) = "en")
    }}
    LIMIT {limit}
    """
    url = "https://query.wikidata.org/sparql"
    headers = {"User-Agent": "MusicRecommender/1.0 (example@example.com)"}
    response = requests.get(
        url, headers=headers, params={"format": "json", "query": query}
    )
    data = response.json()
    return jsonify(
        [item["similarArtistLabel"]["value"] for item in data["results"]["bindings"]]
    )


if __name__ == "__main__":
    # stromae = api.Search().entity("artist").query("stromae").execute()
    # print(stromae)
    # a = (
    #     api.Search()
    #     .entity("artist")
    #     .tag("dance-pop")
    #     .inc("tags")
    #     .country(stromae.artists[0].country)
    #     .execute()
    # )
    # print(list((b.name, b.tags) for b in a.artists))
    # # res = (
    # #     api.Lookup()
    # #     .entity("artist")
    # #     .id(stromae.artists[0].id)
    # #     .inc("artist-rels")
    # #     .execute_json()
    # # )
    # # print(res)
    # # artpop = (
    # #     api.Lookup()
    # #     .entity("genre")
    # #     .id("930ef127-3653-4677-9b95-ecc90c7c1a14")
    # #     .inc("work-rels")
    # #     .execute_json()
    # # )
    # # print(artpop)

    # pass
    app.run(debug=True)
