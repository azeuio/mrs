#!/bin/env python3
import requests
import dataclasses
from typing import List, Dict, Any, Optional, Literal

ROOT = "https://musicbrainz.org/ws/2/"

# entity types (area, artist, event, genre, instrument, label, place, recording, release, release-group, series, work, url)
_ENTITY_TYPES: List[str] = [
    "area",
    "artist",
    "event",
    "genre",
    "instrument",
    "label",
    "place",
    "recording",
    "release",
    "release-group",
    "series",
    "work",
    "url",
]

ENTITY_TYPING = Literal[
    "area",
    "artist",
    "event",
    "genre",
    "instrument",
    "label",
    "place",
    "recording",
    "release",
    "release-group",
    "series",
    "work",
    "url",
]


@dataclasses.dataclass
class Area:
    id: str
    type: str
    type_id: str
    name: str
    sort_name: str
    life_span: dict


@dataclasses.dataclass
class LifeSpan:
    begin: Optional[str]
    end: Optional[str]
    end_flag: bool


@dataclasses.dataclass
class Alias:
    type: str
    type_id: str
    name: str
    sort_name: str
    locale: str
    primary: bool
    begin_date: Optional[str]
    end_date: Optional[str]


@dataclasses.dataclass
class Tag:
    count: int
    name: str


@dataclasses.dataclass
class Artist:
    id: str
    type: str
    type_id: str
    score: int
    gender: str
    gender_id: str
    name: str
    sort_name: str
    country: str
    area: Area
    begin_area: Area
    disambiguation: str
    isni_list: List[str]
    life_span: LifeSpan
    aliases: List[Alias]
    tags: List[Tag]


@dataclasses.dataclass
class SearchResults:
    created: str
    count: int
    offset: int


@dataclasses.dataclass
class ArtistSearchResults(SearchResults):
    artists: List[Artist]


def parse_area(area: dict) -> Area:
    return Area(
        id=area.get("id"),
        type=area.get("type"),
        type_id=area.get("type-id"),
        name=area.get("name"),
        sort_name=area.get("sort-name"),
        life_span=area.get("life-span"),
    )


def parse_life_span(life_span: dict) -> LifeSpan:
    return LifeSpan(
        begin=life_span.get("begin") if "begin" in life_span else None,
        end=life_span.get("end") if "end" in life_span else None,
        end_flag=True if "ended" in life_span and life_span.get("ended") else False,
    )


def parse_alias(alias: dict) -> Alias:
    return Alias(
        type=alias.get("type"),
        type_id=alias.get("type-id", None),
        name=alias.get("name"),
        sort_name=alias.get("sort-name"),
        locale=alias.get("locale"),
        primary=alias.get("primary"),
        begin_date=alias.get("begin-date"),
        end_date=alias.get("end-date"),
    )


def parse_artist(artist: dict) -> Artist:
    return Artist(
        id=artist.get("id"),
        type=artist.get("type"),
        type_id=artist.get("type-id"),
        score=(
            artist.get("score")
            if "score" in artist and artist.get("score") is not None
            else 0
        ),
        gender=artist.get("gender"),
        gender_id=artist.get("gender-id"),
        name=artist.get("name"),
        sort_name=artist.get("sort-name"),
        country=artist.get("country"),
        area=parse_area(artist.get("area")),
        begin_area=parse_area(artist.get("begin-area")),
        disambiguation=artist.get("disambiguation"),
        isni_list=artist.get("isni-list") if "isni-list" in artist else [],
        life_span=parse_life_span(artist.get("life-span")),
        aliases=[parse_alias(alias) for alias in artist.get("aliases")],
        tags=[
            Tag(count=tag.get("count"), name=tag.get("name"))
            for tag in artist.get("tags")
        ],
    )


def search(
    entity: ENTITY_TYPING, query: str, limit: int = 10, offset: int = 0
) -> SearchResults:
    if entity not in _ENTITY_TYPES:
        raise ValueError(
            f"Invalid entity type: {entity}. Must be one of {_ENTITY_TYPES}"
        )
    print(f"Searching for {entity} with query: {query}")
    url = f"{ROOT}{entity}/?query={query}&limit={limit}&offset={offset}&fmt=json"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()

    if entity == "artist":
        return ArtistSearchResults(
            created=data.get("created"),
            count=data.get("count"),
            offset=data.get("offset"),
            artists=[parse_artist(artist) for artist in data.get("artists")],
        )


def hello():
    # res = search("artist", "Bach", limit=3)
    res = search("area", "Berlin", limit=3)
    print(res)
    # print(res.artists)
    # print(list(artist.id for artist in res.artists))


if __name__ == "__main__":
    hello()
