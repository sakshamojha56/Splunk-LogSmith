import json
import logging
from typing import Any, Dict, Iterable, List, Optional


class SaiaDataModelsCollection:
    """
    A collection wrapper for managing Splunk datamodel metadata in the KV Store.

    This class provides CRUD operations for storing and retrieving datamodel dataset
    definitions and their metadata (fields, acceleration, lineage, etc.) from Splunk's
    KV Store collection 'saia_datamodels'.

    Each entry represents a single dataset within a datamodel, storing information like:
    - The parent datamodel name and dataset name
    - Field definitions (simple and calculated)
    - SPL query constraints
    - Acceleration settings
    - Lineage and hierarchy information

    Attributes:
        logger: Logger instance for this class.
        saia_data_models_data: Reference to the 'saia_datamodels' KV Store collection.
        JSON_FIELDS: Tuple of field names that require JSON serialization/deserialization.
    """

    JSON_FIELDS = (
        "fields",
        "acceleration",
        "group_by",
        "objects_to_group",
    )

    def __init__(self, service) -> None:
        """
        Initialize the SaiaDataModelsCollection with a Splunk service connection.

        Args:
            service: A Splunk service connection object with access to kvstore.

        Raises:
            Exception: If the 'saia_datamodels' KV Store collection is not found.
        """
        try:
            self.logger = logging.Logger(self.__class__.__name__)
            self.saia_data_models_data = service.kvstore["saia_datamodels"]
        except KeyError:
            raise Exception("KVStore collection not found")

    def get(self) -> List[Dict[str, Any]]:
        """
        Retrieve all datamodel dataset entries from the KV Store.

        Returns:
            A list of all dataset records with deserialized JSON fields.
        """
        results = self.saia_data_models_data.data.query()
        return [self._deserialize_entry(result) for result in results]

    def query(self, data_model: str, dataset_name: str) -> Optional[Dict[str, Any]]:
        """
        Query for a specific dataset by datamodel name and dataset name.

        Args:
            data_model: The parent datamodel name to search for.
            dataset_name: The dataset/object name within the datamodel.

        Returns:
            The matching dataset record with deserialized fields, or None if not found.
        """
        results = self.saia_data_models_data.data.query(
            query={"data_model": data_model, "name": dataset_name}
        )
        if not results:
            return None
        return self._deserialize_entry(results[0])

    def insert(self, entry: Dict[str, Any]) -> Dict[str, Any]:
        """
        Insert a new dataset entry into the KV Store.

        Args:
            entry: A dictionary containing dataset metadata including data_model,
                   name, fields, updated_spl_query, acceleration, etc.

        Returns:
            The result of the insert operation from KV Store.
        """
        serialized = self._serialize_entry(entry)
        return self.saia_data_models_data.data.insert(serialized)

    def update(self, key: str, entry: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing dataset entry in the KV Store.

        Args:
            key: The KV Store key (_key) of the record to update.
            entry: A dictionary containing updated dataset metadata.

        Returns:
            The result of the update operation from KV Store.
        """
        serialized = self._serialize_entry(entry)
        return self.saia_data_models_data.data.update(key, serialized)

    def all_clear(self) -> None:
        """
        Delete all dataset entries from the KV Store collection.

        Returns:
            The result of the delete operation.
        """
        return self.saia_data_models_data.data.delete()

    def clear(self, data_model: str, dataset_name: str) -> None:
        """
        Delete a specific dataset entry by datamodel and dataset name.

        Args:
            data_model: The parent datamodel name.
            dataset_name: The dataset/object name to delete.

        Returns:
            The result of the delete operation.
        """
        return self.saia_data_models_data.data.delete(
            query=json.dumps({"data_model": data_model, "name": dataset_name})
        )

    def batch_save(self, entries: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Batch insert multiple dataset entries into the KV Store.

        Args:
            entries: An iterable of dataset dictionaries to insert.

        Returns:
            The result of the batch save operation, or empty list if no entries.
        """
        serialized_entries: List[Dict[str, Any]] = [
            self._serialize_entry(entry) for entry in entries
        ]
        if not serialized_entries:
            return []
        return self.saia_data_models_data.data.batch_save(*serialized_entries)

    def _serialize_entry(self, entry: Dict[str, Any]) -> Dict[str, Any]:
        """
        Serialize an entry for storage in KV Store.

        Converts nested structures (lists, dicts) to JSON strings for fields
        defined in JSON_FIELDS, and handles special type conversions for
        'depth' and 'is_child' fields.

        Args:
            entry: The dataset entry dictionary to serialize.

        Returns:
            A new dictionary with JSON-encoded complex fields.
        """
        serialized = dict(entry)

        if "depth" in serialized and not isinstance(serialized["depth"], str):
            serialized["depth"] = str(serialized["depth"])

        if "is_child" in serialized and not isinstance(serialized["is_child"], str):
            serialized["is_child"] = json.dumps(serialized["is_child"])

        for field in self.JSON_FIELDS:
            value = serialized.get(field)
            if value is not None and not isinstance(value, str):
                serialized[field] = json.dumps(value)

        return serialized

    def _deserialize_entry(self, entry: Dict[str, Any]) -> Dict[str, Any]:
        """
        Deserialize an entry retrieved from KV Store.

        Parses JSON strings back into Python objects for fields defined in
        JSON_FIELDS, and handles special type conversions for 'depth' and
        'is_child' fields.

        Args:
            entry: The dataset entry dictionary from KV Store.

        Returns:
            A new dictionary with parsed Python objects for complex fields.
        """
        deserialized = dict(entry)

        if "depth" in deserialized:
            try:
                deserialized["depth"] = int(deserialized["depth"])
            except (TypeError, ValueError):
                pass

        if "is_child" in deserialized and isinstance(deserialized["is_child"], str):
            try:
                deserialized["is_child"] = json.loads(deserialized["is_child"])
            except json.JSONDecodeError:
                pass

        for field in self.JSON_FIELDS:
            value = deserialized.get(field)
            if isinstance(value, str):
                try:
                    deserialized[field] = json.loads(value)
                except json.JSONDecodeError:
                    pass

        return deserialized
