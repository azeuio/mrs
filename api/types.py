import dataclasses
from typing import Dict, List, Literal, Optional

#################### Constants ####################

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
class Genre:
    id: str
    name: str
    disambiguation: str


@dataclasses.dataclass
class Collection:
    id: str
    name: str
    type: str
    type_id: str
    count: int
    entity_type: str
    editor: str


#################### SearchResults ####################


@dataclasses.dataclass
class Coordinates:
    latitude: float
    longitude: float


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
class Event:
    id: str
    type: str
    score: int
    name: str
    life_span: LifeSpan
    relations: List[Dict[str, str]]


@dataclasses.dataclass
class Instrument:
    id: str
    type: str
    type_id: str
    name: str
    score: int
    aliases: List[Alias]
    tags: List[Tag]


@dataclasses.dataclass
class Label:
    id: str
    type: str
    type_id: str
    score: int
    name: str
    sort_name: str
    label_code: int
    disambiguation: str
    country: str
    area: Area
    life_span: LifeSpan
    aliases: List[Alias]
    tags: List[Tag]


@dataclasses.dataclass
class Place:
    id: str
    type: str
    type_id: str
    score: int
    name: str
    address: str
    area: Area
    coordinates: Coordinates
    life_span: LifeSpan
    aliases: List[Alias]


@dataclasses.dataclass
class ArtistCredit:
    name: str
    artists: List[Artist]


@dataclasses.dataclass
class ReleaseGroup:
    id: str
    title: str
    primary_type: str
    primary_type_id: str
    secondary_types: List[str]
    secondary_types_id: List[str]


@dataclasses.dataclass
class ReleaseEvent:
    date: str
    area: Area


@dataclasses.dataclass
class Track:
    id: str
    number: str
    title: str
    length: int


@dataclasses.data
class Media:
    position: int
    format: str
    track_count: int
    track_offset: int
    track: List[Track]


@dataclasses.dataclass
class Release:
    id: str
    status: str
    status_id: str
    count: int
    title: str
    date: str
    country: str
    track_count: int
    artist_credit: List[ArtistCredit]
    release_group: ReleaseGroup
    release_events: List[ReleaseEvent]
    media: List[Dict[str, str]]


@dataclasses.dataclass
class Recording:
    id: str
    score: int
    title: str
    length: int
    video: bool
    artist_credit: List[ArtistCredit]
    first_release_date: str
    releases: List[Dict[str, str]]


@dataclasses.dataclass
class SearchResults:
    created: str
    count: int
    offset: int


@dataclasses.dataclass
class AreaSearchResults(SearchResults):
    areas: List[Area]


@dataclasses.dataclass
class ArtistSearchResults(SearchResults):
    artists: List[Artist]


@dataclasses.dataclass
class EventSearchResults(SearchResults):
    events: List[Event]


@dataclasses.dataclass
class GenreSearchResults(SearchResults):
    genres: List[Genre]


@dataclasses.dataclass
class InstrumentSearchResults(SearchResults):
    instruments: List[Instrument]


@dataclasses.dataclass
class LabelSearchResults(SearchResults):
    labels: List[Label]


@dataclasses.dataclass
class PlaceSearchResults(SearchResults):
    places: List[Place]


@dataclasses.dataclass
class RecordingSearchResults(SearchResults):
    recordings: List[Recording]


@dataclasses.dataclass
class ReleaseSearchResults(SearchResults):
    releases: List[Release]


#################### LookupResults ####################


@dataclasses.dataclass
class GenreArtistLookupResults:
    id: str
    count: int
    name: str
    disambiguation: str


@dataclasses.dataclass
class ArtitstLookupResults:
    id: str
    end_area: Area
    ipis: List[str]
    life_span: LifeSpan
    type: Literal["Person", "Group", "Other"]
    type_id: str
    name: str
    sort_name: str
    gender: str
    gender_id: str
    isnis: List[str]
    begin_area: Area
    area: Area
    country: str
    disambiguation: str
    genres: List[GenreArtistLookupResults]
