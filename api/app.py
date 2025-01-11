from flask import Flask, request, jsonify
from mongoengine import Document, StringField, DateTimeField, ReferenceField, IntField, connect
from datetime import datetime, timezone
import os

app = Flask(__name__)

mongo_uri = "mongodb+srv://lucas:lucasmrs@cluster0.mwrx5.mongodb.net/flaskdb?retryWrites=true&w=majority"

connect("flaskdb", host=mongo_uri)

class Song(Document):
    title = StringField(required=True, unique=True)
    artist = StringField()
    album = StringField()
    release_date = DateTimeField()

class UserSongPlay(Document):
    username = StringField(required=True)
    song = ReferenceField(Song, required=True)
    play_count = IntField(default=1)
    last_played = DateTimeField(default=datetime.now(timezone.utc))

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask MongoDB API for song plays!"})

@app.route('/play', methods=['POST'])
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
            user_song_play.update(inc__play_count=1, set__last_played=datetime.now(timezone.utc))
            return jsonify({"message": "Song play count updated!"}), 200
        else:
            UserSongPlay(username=username, song=song, play_count=1, last_played=datetime.now(timezone.utc)).save()
            return jsonify({"message": "Song play recorded for the first time!"}), 201
    else:
        song = Song(title=song_title, artist=data.get("artist", ""), album=data.get("album", ""), release_date=datetime.now(timezone.utc))
        song.save()

        UserSongPlay(username=username, song=song, play_count=1, last_played=datetime.now(timezone.utc)).save()
        return jsonify({"message": "New song created and play recorded!"}), 201

@app.route('/least_played', methods=['GET'])
def least_played_songs():
    aggregation = UserSongPlay.objects.aggregate([
        {"$group": {"_id": "$song", "total_plays": {"$sum": "$play_count"}}},
        {"$sort": {"total_plays": 1}},
        {"$limit": 10},
    ])
    
    least_played = []
    for entry in aggregation:
        song = Song.objects(id=entry["_id"]).first()
        if song:
            least_played.append({
                "title": song.title,
                "artist": song.artist,
                "album": song.album,
                "release_date": song.release_date,
                "total_plays": entry["total_plays"]
            })

    return jsonify({"least_played_songs": least_played}), 200

if __name__ == '__main__':
    app.run(debug=True)
