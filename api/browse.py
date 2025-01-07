import dataclasses
import requests

from typing import Any, Dict, List, Literal, overload
from api.api import ROOT, parse_area, parse_artist, parse_event
from api.types import _ENTITY_TYPES, ENTITY_TYPING, Area, Artist, Collection, Event


class AbstractBrowse:
    LINKED_ENTITY_TYPE = Literal[
        "area",
        "artist",
        "collection",
        "event",
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
    _LINKED_ENTITY_TYPES: List[LINKED_ENTITY_TYPE] = [
        "area",
        "artist",
        "collection",
        "event",
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
    _entity: LINKED_ENTITY_TYPE = None
    _query_params: Dict[str, str] = {"fmt": "json", "limit": "10"}

    def entity(self, entity: LINKED_ENTITY_TYPE):
        self._entity = entity
        return self

    def limit(self, limit: int):
        self._query_params["limit"] = str(limit)
        return self

    def offset(self, offset: int):
        self._query_params["offset"] = str(offset)
        return self

    def execute(self):
        assert self._entity is not None, "Entity type must be set"
        res = self._browse(self._entity, self._query_params)
        print(res)
        return res

    @staticmethod
    def _browse(
        entity: LINKED_ENTITY_TYPE,
        query_params: Dict[str, str],
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
        if entity not in AbstractBrowse._LINKED_ENTITY_TYPES:
            raise ValueError(
                f"Invalid entity type: {entity}. Must be one of {AbstractBrowse._LINKED_ENTITY_TYPES}"
            )
        query = "&".join(f"{key}={value}" for (key, value) in query_params.items())
        print(f"Browse {entity} with query params: {query}")
        url = f"{ROOT}{entity}?{query}"
        response = requests.get(url)
        response.raise_for_status()
        a = response.json()
        return a


class AreaBrowse(AbstractBrowse):
    @dataclasses.dataclass
    class Result:
        area_count: int
        area_offset: int
        areas: List[Area]

    _entity: AbstractBrowse.LINKED_ENTITY_TYPE = "area"

    def __init__(self, query_params: Dict[str, str]):
        super().__init__()
        self._query_params = query_params

    def collection(self, collection_id: str):
        self._query_params["collection"] = collection_id
        return self

    def execute(self) -> Result:
        res = super().execute()
        return self.Result(
            area_count=res["area-count"],
            area_offset=res["area-offset"],
            areas=[parse_area(area) for area in res["areas"]],
        )


class ArtistBrowse(AbstractBrowse):
    @dataclasses.dataclass
    class Result:
        artist_count: int
        artist_offset: int
        artists: List[Artist]

    _entity: AbstractBrowse.LINKED_ENTITY_TYPE = "artist"

    def __init__(self, query_params: Dict[str, str]):
        super().__init__()
        self._query_params = query_params

    def area(self, area_id: str):
        self._query_params["area"] = area_id
        return self

    def collection(self, collection_id: str):
        self._query_params["collection"] = collection_id
        return self

    def recording(self, recording_id: str):
        self._query_params["recording"] = recording_id
        return self

    def release(self, release_id: str):
        self._query_params["release"] = release_id
        return self

    def release_group(self, release_group_id: str):
        self._query_params["release-group"] = release_group_id
        return self

    def work(self, work_id: str):
        self._query_params["work"] = work_id
        return self

    def execute(self) -> Result:
        res = super().execute()
        return self.Result(
            artist_count=res["artist-count"],
            artist_offset=res["artist-offset"],
            artists=[parse_artist(artist) for artist in res["artists"]],
        )


class CollectionBrowse(AbstractBrowse):
    @dataclasses.dataclass
    class Result:
        collection_count: int
        collection_offset: int
        collections: List[Collection]

    _entity: AbstractBrowse.LINKED_ENTITY_TYPE = "collection"

    def __init__(self, query_params: Dict[str, str]):
        super().__init__()
        self._query_params = query_params

    def area(self, area_id: str):
        self._query_params["area"] = area_id
        return self

    def artist(self, artist_id: str):
        self._query_params["artist"] = artist_id
        return self

    def editor(self, editor_id: str):
        self._query_params["editor"] = editor_id
        return self

    def event(self, event_id: str):
        self._query_params["event"] = event_id
        return self

    def label(self, label_id: str):
        self._query_params["label"] = label_id
        return self

    def place(self, place_id: str):
        self._query_params["place"] = place_id
        return self

    def recording(self, recording_id: str):
        self._query_params["recording"] = recording_id
        return self

    def release(self, release_id: str):
        self._query_params["release"] = release_id
        return self

    def release_group(self, release_group_id: str):
        self._query_params["release-group"] = release_group_id
        return self

    def work(self, work_id: str):
        self._query_params["work"] = work_id
        return self

    def execute(self):
        res = super().execute()
        return self.Result(
            collection_count=res["collection-count"],
            collection_offset=res["collection-offset"],
            collections=[
                Collection(
                    id=collection["id"],
                    name=collection["name"],
                    type=collection["type"],
                    type_id=collection["type-id"],
                    count=collection[f"{collection['entity-type']}-count"],
                    entity_type=collection["entity-type"],
                    editor=collection["editor"],
                )
                for collection in res["collections"]
            ],
        )


class EventBrowse(AbstractBrowse):
    @dataclasses.dataclass
    class Result:
        event_count: int
        event_offset: int
        events: List[Event]

    _entity: AbstractBrowse.LINKED_ENTITY_TYPE = "event"

    def __init__(self, query_params: Dict[str, str]):
        super().__init__()
        self._query_params = query_params

    def area(self, area_id: str):
        self._query_params["area"] = area_id
        return self

    def artist(self, artist_id: str):
        self._query_params["artist"] = artist_id
        return self

    def collection(self, collection_id: str):
        self._query_params["collection"] = collection_id
        return self

    def place(self, place_id: str):
        self._query_params["place"] = place_id
        return self

    def execute(self) -> Result:
        res = super().execute()
        print(res)
        return self.Result(
            event_count=res["event-count"],
            event_offset=res["event-offset"],
            events=[parse_event(event) for event in res["events"]],
        )


# class InstrumentBrowse(AbstractBrowse):
#     @dataclasses.dataclass
#     class Result:
#         instrument_count: int
#         instrument_offset: int
#         instruments: List[Instrument]


class Browse(AbstractBrowse):
    @overload
    def entity(self, entity: Literal["area"]) -> AreaBrowse: ...
    @overload
    def entity(self, entity: Literal["artist"]) -> ArtistBrowse: ...
    @overload
    def entity(self, entity: Literal["collection"]) -> CollectionBrowse: ...
    @overload
    def entity(self, entity: Literal["event"]) -> EventBrowse: ...

    @overload
    def entity(self, entity: Literal["instrument"]) -> AreaBrowse: ...
    def entity(self, entity: ENTITY_TYPING):
        if entity == "area":
            return AreaBrowse(self._query_params)
        if entity == "artist":
            return ArtistBrowse(self._query_params)
        if entity == "collection":
            return CollectionBrowse(self._query_params)
        if entity == "event":
            return EventBrowse(self._query_params)
        if entity == "instrument":
            return AreaBrowse(self._query_params).entity("instrument")
        return super().entity(entity)
