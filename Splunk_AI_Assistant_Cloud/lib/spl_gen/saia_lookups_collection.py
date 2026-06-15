import json
import logging
from typing import Any, Dict, List, Optional


class SaiaLookupsCollection:
    """
    A collection wrapper for managing Splunk lookup metadata in the KV Store.

    This class provides CRUD operations for storing and retrieving lookup definitions
    and their metadata (type, fields, app ownership, etc.) from Splunk's KV Store
    collection 'saia_lookups'.

    Attributes:
        logger: Logger instance for this class.
        saia_lookups_data: Reference to the 'saia_lookups' KV Store collection.
    """

    def __init__(self, service) -> None:
        """
        Initialize the SaiaLookupsCollection with a Splunk service connection.

        Args:
            service: A Splunk service connection object with access to kvstore.

        Raises:
            Exception: If the 'saia_lookups' KV Store collection is not found.
        """
        try:
            self.logger = logging.Logger(self.__class__.__name__)
            self.saia_lookups_data = service.kvstore["saia_lookups"]
        except KeyError:
            raise Exception("KVStore collection not found")

    def get(self) -> List[Dict[str, Any]]:
        """
        Retrieve all lookup entries from the KV Store.

        Returns:
            A list of all lookup records stored in the collection.
        """
        results = self.saia_lookups_data.data.query()
        return results

    def query(self, title: str, type_: str) -> Optional[Dict[str, Any]]:
        """
        Query for a specific lookup by title and type.

        Args:
            title: The lookup title/name to search for.
            type_: The lookup type (e.g., 'csv', 'kvstore', 'external').

        Returns:
            The matching lookup record, or None if not found.
        """
        results = self.saia_lookups_data.data.query(
            query={"title": title, "type": type_}
        )
        if len(results) == 0:
            return None
        else:
            ret_obj = results[0]
            return ret_obj

    def insert(
        self,
        title: str,
        type_: str,
        fields_list: str,
        app_name: str,
        user_id: str,
    ) -> Dict[str, Any]:
        """
        Insert a new lookup entry into the KV Store.

        Args:
            title: The lookup name/title.
            type_: The lookup type (e.g., 'csv', 'kvstore', 'external').
            fields_list: Comma-separated list of fields in the lookup.
            app_name: The Splunk app that owns this lookup.
            user_id: The user/role permissions for this lookup.

        Returns:
            The result of the insert operation from KV Store.
        """
        return self.saia_lookups_data.data.insert(
            {
                "title": title,
                "type": type_,
                "fields_list": fields_list,
                "app_name": app_name,
                "user_id": user_id,
            }
        )

    def update(
        self,
        key: str,
        title: str,
        type_: str,
        fields_list: str,
        app_name: str,
        user_id: str,
    ) -> Dict[str, Any]:
        """
        Update an existing lookup entry in the KV Store.

        Args:
            key: The KV Store key (_key) of the record to update.
            title: The lookup name/title.
            type_: The lookup type (e.g., 'csv', 'kvstore', 'external').
            fields_list: Comma-separated list of fields in the lookup.
            app_name: The Splunk app that owns this lookup.
            user_id: The user/role permissions for this lookup.

        Returns:
            The result of the update operation from KV Store.
        """
        return self.saia_lookups_data.data.update(
            key,
            {
                "title": title,
                "type": type_,
                "fields_list": fields_list,
                "app_name": app_name,
                "user_id": user_id,
            },
        )

    def all_clear(self) -> None:
        """
        Delete all lookup entries from the KV Store collection.

        Returns:
            The result of the delete operation.
        """
        return self.saia_lookups_data.data.delete()

    def clear(
        self,
        title: str,
        type_: str,
        fields_list: str,
        app_name: str,
        user_id: str,
    ) -> None:
        """
        Delete a specific lookup entry matching all provided fields.

        Args:
            title: The lookup name/title.
            type_: The lookup type (e.g., 'csv', 'kvstore', 'external').
            fields_list: Comma-separated list of fields in the lookup.
            app_name: The Splunk app that owns this lookup.
            user_id: The user/role permissions for this lookup.

        Returns:
            The result of the delete operation.
        """
        return self.saia_lookups_data.data.delete(
            query=json.dumps(
                {
                    "title": title,
                    "type": type_,
                    "fields_list": fields_list,
                    "app_name": app_name,
                    "user_id": user_id,
                }
            )
        )

    def batch_save(self, entries: List[Dict[str, Any]]) -> None:
        """
        Batch insert multiple lookup entries into the KV Store.

        Args:
            entries: A list of lookup dictionaries to insert.

        Returns:
            The result of the batch save operation.
        """
        return self.saia_lookups_data.data.batch_save(*entries)
