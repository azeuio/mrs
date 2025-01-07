import dataclasses
from typing import Any, Dict, List, Literal, Union, overload
import requests

from api.api import ROOT
from api.types import _ENTITY_TYPES, ENTITY_TYPING, Area, LifeSpan


@dataclasses.dataclass
class LookupArtistResults:
    id: str
    gender: str
    gender_id: str
    name: str
    sort_name: str
    type: str
    type_id: str
    ipis: List[str]
    area: Area
    begin_area: Area
    end_area: Area
    life_span: LifeSpan
    disambiguation: str
    country: str
    isnis: List[str]


class AbstractLookup:
    _INC_TYPE = Literal[
        "discids",
        "media",
        "isrcs",
        "artist-credits",
        "various-artists",
        "aliases",
        "annotation",
        "tags",
        "ratings",
        "user-tags",
        "user-ratings",
        "genres",
        "user-genres",
    ]
    _entity: ENTITY_TYPING = None
    _id: str = None
    _inc: List[_INC_TYPE] = []

    def entity(self, entity: ENTITY_TYPING):
        self._entity = entity
        return self

    def id(self, id: str):
        self._id = id
        return self

    def inc(self, *inc: _INC_TYPE):
        self._inc = inc
        return self

    def execute(self):
        assert self._entity is not None, "Entity type must be set"
        assert self._id is not None, "ID must be set"
        return self._lookup(self._entity, self._id, self._inc)

    @staticmethod
    def _lookup(
        entity: ENTITY_TYPING,
        id: str,
        inc: List[_INC_TYPE] = [],
    ) -> Dict[str, Any]:
        """Look up an entity in the MusicBrainz database by its ID.

        Args:
            entity (ENTITY_TYPING): The type of entity to look up.
            id (str): The ID of the entity to look up.
            inc (Optional[str], optional): Include additional information. Defaults to None.

        Raises:
            ValueError: If the entity type is not valid.

        Returns:
            Dict[str, Any]: The entity data.
        """
        if entity not in _ENTITY_TYPES:
            raise ValueError(
                f"Invalid entity type: {entity}. Must be one of {_ENTITY_TYPES}"
            )
        print(f"Looking up {entity} with ID: {id}. Include: {inc}")
        url = f"{ROOT}{entity}/{id}?inc={'+'.join(inc) if inc else ''}&fmt=json"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()


class ArtistLookup(AbstractLookup):
    _INC_TYPE = Union[
        AbstractLookup._INC_TYPE,
        Literal["recordings", "releases", "release-groups", "works"],
    ]

    def inc(self, *inc: _INC_TYPE):
        return super().inc(*inc)

    def execute(self) -> LookupArtistResults:
        return LookupArtistResults(**super().execute())


class CollectionLookup(AbstractLookup):
    _INC_TYPE = Union[
        AbstractLookup._INC_TYPE,
        Literal["user-collections"],
    ]

    def inc(self, *inc: _INC_TYPE):
        return super().inc(*inc)


class LabelLookup(AbstractLookup):
    _INC_TYPE = Union[
        AbstractLookup._INC_TYPE,
        Literal["releases"],
    ]

    def inc(self, *inc: _INC_TYPE):
        return super().inc(*inc)


class RecordingLookup(AbstractLookup):
    _INC_TYPE = Union[
        AbstractLookup._INC_TYPE,
        Literal["artists", "releases", "release-groups", "isrcs", "url-rels"],
    ]

    def inc(self, *inc: _INC_TYPE):
        return super().inc(*inc)


class ReleaseLookup(AbstractLookup):
    _INC_TYPE = Union[
        AbstractLookup._INC_TYPE,
        Literal["artists", "collections", "labels", "recordings", "release-groups"],
    ]

    def inc(self, *inc: _INC_TYPE):
        return super().inc(*inc)


class ReleaseGroupLookup(AbstractLookup):
    _INC_TYPE = Union[
        AbstractLookup._INC_TYPE,
        Literal["artists", "releases"],
    ]

    def inc(self, *inc: _INC_TYPE):
        return super().inc(*inc)


class Lookup(AbstractLookup):
    @overload
    def entity(self, entity: Literal["area"]) -> AbstractLookup: ...
    @overload
    def entity(self, entity: Literal["artist"]) -> ArtistLookup: ...
    @overload
    def entity(self, entity: Literal["collection"]) -> CollectionLookup: ...
    @overload
    def entity(self, entity: Literal["event"]) -> AbstractLookup: ...
    @overload
    def entity(self, entity: Literal["genre"]) -> AbstractLookup: ...
    @overload
    def entity(self, entity: Literal["instrument"]) -> AbstractLookup: ...
    @overload
    def entity(self, entity: Literal["label"]) -> LabelLookup: ...
    @overload
    def entity(self, entity: Literal["place"]) -> AbstractLookup: ...
    @overload
    def entity(self, entity: Literal["recording"]) -> RecordingLookup: ...
    @overload
    def entity(self, entity: Literal["release"]) -> ReleaseLookup: ...
    @overload
    def entity(self, entity: Literal["release-group"]) -> ReleaseGroupLookup: ...
    @overload
    def entity(self, entity: Literal["series"]) -> AbstractLookup: ...
    @overload
    def entity(self, entity: Literal["work"]) -> AbstractLookup: ...
    @overload
    def entity(self, entity: Literal["url"]) -> AbstractLookup: ...
    def entity(self, entity: ENTITY_TYPING):
        self._entity = entity
        return self


if __name__ == "__main__":
    a = CollectionLookup().inc()
