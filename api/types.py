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


#################### SearchResults ####################


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
