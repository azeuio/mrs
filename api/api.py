#!/bin/env python3
import requests
from typing import List, Dict, Any, Literal, overload

from api.types import (
    _ENTITY_TYPES,
    ENTITY_TYPING,
    Alias,
    Area,
    AreaSearchResults,
    Artist,
    ArtistSearchResults,
    Coordinates,
    Event,
    EventSearchResults,
    Genre,
    GenreSearchResults,
    Instrument,
    InstrumentSearchResults,
    Label,
    LabelSearchResults,
    LifeSpan,
    Place,
    PlaceSearchResults,
    Recording,
    RecordingSearchResults,
    Release,
    ReleaseSearchResults,
    SearchResults,
    Tag,
)

ROOT = "https://musicbrainz.org/ws/2/"

# entity types (area, artist, event, genre, instrument, label, place, recording, release, release-group, series, work, url)


def parse_coordinates(coordinates: dict) -> Coordinates:
    try:
        return Coordinates(
            latitude=float(coordinates.get("latitude")),
            longitude=float(coordinates.get("longitude")),
        )
    except (ValueError, TypeError):
        return None


def parse_area(area: dict) -> Area:
    if not area:
        return None
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
    if not artist:
        return None
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
        aliases=[parse_alias(alias) for alias in (artist.get("aliases") or [])],
        tags=[
            Tag(count=tag.get("count"), name=tag.get("name"))
            for tag in artist.get("tags") or []
        ],
    )


def parse_event(event: dict) -> Event:
    return Event(
        id=event.get("id"),
        type=event.get("type"),
        score=(
            event.get("score")
            if "score" in event and event.get("score") is not None
            else 0
        ),
        life_span=parse_life_span(event.get("life-span")),
        name=event.get("name"),
        relations=event.get("relations"),
    )


@overload
def search(
    entity: Literal["area"], query: str, limit: int = 10, offset: int = 0
) -> AreaSearchResults: ...
@overload
def search(
    entity: Literal["artist"], query: str, limit: int = 10, offset: int = 0
) -> ArtistSearchResults: ...
@overload
def search(
    entity: Literal["event"], query: str, limit: int = 10, offset: int = 0
) -> EventSearchResults: ...
@overload
def search(
    entity: Literal["genre"], query: str, limit: int = 10, offset: int = 0
) -> GenreSearchResults: ...
@overload
def search(
    entity: Literal["instrument"], query: str, limit: int = 10, offset: int = 0
) -> InstrumentSearchResults: ...
@overload
def search(
    entity: Literal["label"], query: str, limit: int = 10, offset: int = 0
) -> LabelSearchResults: ...
@overload
def search(
    entity: Literal["place"], query: str, limit: int = 10, offset: int = 0
) -> PlaceSearchResults: ...
@overload
def search(
    entity: Literal["recording"], query: str, limit: int = 10, offset: int = 0
) -> RecordingSearchResults: ...
@overload
def search(
    entity: Literal["release"], query: str, limit: int = 10, offset: int = 0
) -> ReleaseSearchResults: ...


@overload
def search(
    entity: ENTITY_TYPING, query: str, limit: int = 10, offset: int = 0
) -> SearchResults: ...


def search(
    entity: ENTITY_TYPING, query: str, limit: int = 10, offset: int = 0
) -> SearchResults:
    """Search for entities in the MusicBrainz database.

    Args:
        entity (ENTITY_TYPING): The type of entity to search for.
        query (str): The search query.
        limit (int, optional): The maximum amount of entries to return. Defaults to 10.
        offset (int, optional): Offset. Defaults to 0.

    Raises:
        ValueError: If the entity type is not valid.

    Returns:
        SearchResults: The search results. The exact structure depends on the entity type.
            (e.g. ArtistSearchResults for entity="artist")
    """
    if entity not in _ENTITY_TYPES:
        raise ValueError(
            f"Invalid entity type: {entity}. Must be one of {_ENTITY_TYPES}"
        )
    print(f"Searching for {entity} with query: {query}")
    url = f"{ROOT}{entity}?query={query}&limit={limit}&offset={offset}&fmt=json"
    print(f"URL: {url}")
    if entity == "genre":
        url = f"{ROOT}{entity}/all?limit={limit}&offset={offset}&fmt=json"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()

    if entity == "area":
        return AreaSearchResults(
            created=data.get("created"),
            count=data.get("count"),
            offset=data.get("offset"),
            areas=[parse_area(area) for area in data.get("areas")],
        )
    if entity == "artist":
        return ArtistSearchResults(
            created=data.get("created"),
            count=data.get("count"),
            offset=data.get("offset"),
            artists=[parse_artist(artist) for artist in data.get("artists")],
        )
    if entity == "event":
        return EventSearchResults(
            created=data.get("created"),
            count=data.get("count"),
            offset=data.get("offset"),
            events=[parse_event(event) for event in data.get("events")],
        )
    if entity == "genre":
        return GenreSearchResults(
            created=data.get("created"),
            count=data.get("count"),
            offset=data.get("offset"),
            genres=[
                Genre(
                    id=genre.get("id"),
                    name=genre.get("name"),
                    disambiguation=genre.get("disambiguation"),
                )
                for genre in data.get("genres")
            ],
        )
    if entity == "instrument":
        return InstrumentSearchResults(
            created=data.get("created"),
            count=data.get("count"),
            offset=data.get("offset"),
            instruments=[
                Instrument(
                    id=instrument.get("id"),
                    type=instrument.get("type"),
                    type_id=instrument.get("type-id"),
                    name=instrument.get("name"),
                    score=instrument.get("score"),
                    aliases=[parse_alias(alias) for alias in instrument.get("aliases")],
                    tags=[
                        Tag(count=tag.get("count"), name=tag.get("name"))
                        for tag in instrument.get("tags")
                    ],
                )
                for instrument in data.get("instruments")
            ],
        )
    if entity == "label":
        return LabelSearchResults(
            created=data.get("created"),
            count=data.get("count"),
            offset=data.get("offset"),
            labels=[
                Label(
                    id=label.get("id"),
                    type=label.get("type"),
                    type_id=label.get("type-id"),
                    score=label.get("score"),
                    name=label.get("name"),
                    sort_name=label.get("sort-name"),
                    label_code=label.get("label-code"),
                    disambiguation=label.get("disambiguation"),
                    country=label.get("country"),
                    area=parse_area(label.get("area")),
                    life_span=parse_life_span(label.get("life-span")),
                    aliases=[parse_alias(alias) for alias in label.get("aliases")],
                    tags=[
                        Tag(count=tag.get("count"), name=tag.get("name"))
                        for tag in label.get("tags")
                    ],
                )
                for label in data.get("labels")
            ],
        )
    if entity == "place":
        return PlaceSearchResults(
            created=data.get("created"),
            count=data.get("count"),
            offset=data.get("offset"),
            places=[
                Place(
                    id=place.get("id"),
                    type=place.get("type"),
                    type_id=place.get("type-id"),
                    score=place.get("score"),
                    name=place.get("name"),
                    address=place.get("address"),
                    area=parse_area(place.get("area")),
                    coordinates=parse_coordinates(place.get("coordinates")),
                    life_span=parse_life_span(place.get("life-span")),
                    aliases=[parse_alias(alias) for alias in place.get("aliases")],
                )
                for place in data.get("places")
            ],
        )
    if entity == "recording":
        return RecordingSearchResults(
            created=data.get("created"),
            count=data.get("count"),
            offset=data.get("offset"),
            recordings=[
                Recording(
                    id=recording.get("id"),
                    score=recording.get("score"),
                    title=recording.get("title"),
                    length=recording.get("length"),
                    disambiguation=recording.get("disambiguation"),
                    video=recording.get("video"),
                    tags=[
                        Tag(count=tag.get("count"), name=tag.get("name"))
                        for tag in recording.get("tags")
                    ],
                )
                for recording in data.get("recordings")
            ],
        )
    if entity == "release":
        return ReleaseSearchResults(
            created=data.get("created"),
            count=data.get("count"),
            offset=data.get("offset"),
            releases=[
                Release(
                    id=release.get("id"),
                    score=release.get("score"),
                    title=release.get("title"),
                    status=release.get("status"),
                    status_id=release.get("status-id"),
                    quality=release.get("quality"),
                    quality_id=release.get("quality-id"),
                    disambiguation=release.get("disambiguation"),
                    date=release.get("date"),
                    country=release.get("country"),
                    barcode=release.get("barcode"),
                    asin=release.get("asin"),
                    tags=[
                        Tag(count=tag.get("count"), name=tag.get("name"))
                        for tag in release.get("tags")
                    ],
                )
                for release in data.get("releases")
            ],
        )
    print(data)
    return SearchResults(
        created=data.get("created"),
        count=data.get("count"),
        offset=data.get("offset"),
    )


class AbstractSearch:
    def entity(self, entity: ENTITY_TYPING):
        self._entity = entity
        return self

    def query(self, query: str):
        self._query = query
        return self

    def limit(self, limit: int):
        self._limit = limit
        return self

    def offset(self, offset: int):
        self._offset = offset
        return self

    def execute(self):
        return search(self._entity, self._query, self._limit, self._offset)


class AreaSearch(AbstractSearch):
    def execute(self):
        return search("area", self._query, self._limit, self._offset)


class ArtistSearch(AbstractSearch):
    def execute(self):
        return search("artist", self._query, self._limit, self._offset)


class EventSearch(AbstractSearch):
    def execute(self):
        return search("event", self._query, self._limit, self._offset)


class GenreSearch(AbstractSearch):
    def query(self, _query):
        """Does not work for genre search"""
        return self

    def execute(self):
        return search("genre", self._query, self._limit, self._offset)


class InstrumentSearch(AbstractSearch):
    def execute(self):
        return search("instrument", self._query, self._limit, self._offset)


class LabelSearch(AbstractSearch):
    def execute(self):
        return search("label", self._query, self._limit, self._offset)


class PlaceSearch(AbstractSearch):
    def execute(self):
        return search("place", self._query, self._limit, self._offset)


class RecordingSearch(AbstractSearch):
    def execute(self):
        return search("recording", self._query, self._limit, self._offset)


class ReleaseSearch(AbstractSearch):
    def execute(self):
        return search("release", self._query, self._limit, self._offset)


class ReleaseGroupSearch(AbstractSearch):
    def execute(self):
        return search("release-group", self._query, self._limit, self._offset)


class SeriesSearch(AbstractSearch):
    def execute(self):
        return search("series", self._query, self._limit, self._offset)


class WorkSearch(AbstractSearch):
    def execute(self):
        return search("work", self._query, self._limit, self._offset)


class UrlSearch(AbstractSearch):
    def execute(self):
        return search("url", self._query, self._limit, self._offset)


class Search(AbstractSearch):
    _entity: ENTITY_TYPING = None
    _query: str = None
    _limit: int = 10
    _offset: int = 0

    def __init__(self):
        pass

    @overload
    def entity(self, entity: Literal["area"]) -> AreaSearch: ...
    @overload
    def entity(self, entity: Literal["artist"]) -> ArtistSearch: ...
    @overload
    def entity(self, entity: Literal["event"]) -> EventSearch: ...
    @overload
    def entity(self, entity: Literal["genre"]) -> GenreSearch: ...
    @overload
    def entity(self, entity: Literal["instrument"]) -> InstrumentSearch: ...
    @overload
    def entity(self, entity: Literal["label"]) -> LabelSearch: ...
    @overload
    def entity(self, entity: Literal["place"]) -> PlaceSearch: ...
    @overload
    def entity(self, entity: Literal["recording"]) -> RecordingSearch: ...
    @overload
    def entity(self, entity: Literal["release"]) -> ReleaseSearch: ...
    @overload
    def entity(self, entity: Literal["release-group"]) -> ReleaseGroupSearch: ...
    @overload
    def entity(self, entity: Literal["series"]) -> SeriesSearch: ...
    @overload
    def entity(self, entity: Literal["work"]) -> WorkSearch: ...
    @overload
    def entity(self, entity: Literal["url"]) -> UrlSearch: ...
    def entity(self, entity: ENTITY_TYPING):
        self._entity = entity
        return self

    def query(self, query: str):
        self._query = query
        return self

    def limit(self, limit: int):
        self._limit = limit
        return self

    def offset(self, offset: int):
        self._offset = offset
        return self

    def execute(self):
        return search(self._entity, self._query, self._limit, self._offset)
