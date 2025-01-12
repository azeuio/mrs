from flask import Flask, request, jsonify
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


if __name__ == "__main__":
    app.run(debug=True)
