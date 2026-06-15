import json
import logging
from typing import Any, Dict, List, Optional


class SaiaMacrosCollection:
    """
    A collection wrapper for managing Splunk macros metadata in the KV Store.

    This class provides CRUD operations for storing and retrieving macro definitions,
    their expanded SPL queries, and associated metadata (lookups, datamodels, args, etc.)
    from Splunk's KV Store collection 'saia_macros'.

    Attributes:
        logger: Logger instance for this class.
        saia_macros_data: Reference to the 'saia_macros' KV Store collection.
    """

    def __init__(self, service) -> None:
        """
        Initialize the SaiaMacrosCollection with a Splunk service connection.

        Args:
            service: A Splunk service connection object with access to kvstore.

        Raises:
            Exception: If the 'saia_macros' KV Store collection is not found.
        """
        try:
            self.logger = logging.Logger(self.__class__.__name__)
            self.saia_macros_data = service.kvstore["saia_macros"]
        except KeyError:
            raise Exception("KVStore collection not found")

    def get(self) -> List[Dict[str, Any]]:
        """
        Retrieve all macro entries from the KV Store.

        Returns:
            A list of all macro records stored in the collection.
        """
        results = self.saia_macros_data.data.query()
        return results

    def query(self, title: str, definition: str) -> Optional[Dict[str, Any]]:
        """
        Query for a specific macro by title and definition.

        Args:
            title: The macro title/name to search for.
            definition: The macro definition to match.

        Returns:
            The matching macro record with parsed JSON content, or None if not found.
        """
        results = self.saia_macros_data.data.query(
            query={"title": title, "definition": definition}
        )
        if len(results) == 0:
            return None
        else:
            ret_obj = results[0]
            if isinstance(ret_obj["content"], str):
                ret_obj["content"] = json.loads(ret_obj["content"])

            return ret_obj

    def insert(
        self,
        title: str,
        definition: str,
        content: str,
        macros_used: List[str],
        updated_spl: str,
        datamodels_used: List[str],
        lookups_used: List[str],
        app_name: str,
        args: List[str],
        user_id: str,
    ) -> Dict[str, Any]:
        """
        Insert a new macro entry into the KV Store.

        Args:
            title: The macro name/title.
            definition: The original macro definition (SPL).
            content: JSON-serialized content metadata.
            macros_used: List of nested macro names used within this macro.
            updated_spl: The fully expanded SPL query with macros resolved.
            datamodels_used: List of datamodel names referenced in the macro.
            lookups_used: List of lookup names referenced in the macro.
            app_name: The Splunk app that owns this macro.
            args: List of argument names accepted by this macro.
            user_id: The user/role permissions for this macro.

        Returns:
            The result of the insert operation from KV Store.
        """
        return self.saia_macros_data.data.insert(
            {
                "title": title,
                "definition": definition,
                "content": content,
                "macros_used": macros_used,
                "updated_spl": updated_spl,
                "datamodels_used": datamodels_used,
                "lookups_used": lookups_used,
                "app_name": app_name,
                "args": args,
                "user_id": user_id,
            }
        )

    def update(
        self,
        key: str,
        title: str,
        definition: str,
        content: str,
        macros_used: List[str],
        updated_spl: str,
        datamodels_used: List[str],
        lookups_used: List[str],
        app_name: str,
        args: List[str],
        user_id: str,
    ) -> Dict[str, Any]:
        """
        Update an existing macro entry in the KV Store.

        Args:
            key: The KV Store key (_key) of the record to update.
            title: The macro name/title.
            definition: The original macro definition (SPL).
            content: JSON-serialized content metadata.
            macros_used: List of nested macro names used within this macro.
            updated_spl: The fully expanded SPL query with macros resolved.
            datamodels_used: List of datamodel names referenced in the macro.
            lookups_used: List of lookup names referenced in the macro.
            app_name: The Splunk app that owns this macro.
            args: List of argument names accepted by this macro.
            user_id: The user/role permissions for this macro.

        Returns:
            The result of the update operation from KV Store.
        """
        return self.saia_macros_data.data.update(
            key,
            {
                "title": title,
                "definition": definition,
                "content": content,
                "macros_used": macros_used,
                "updated_spl": updated_spl,
                "datamodels_used": datamodels_used,
                "lookups_used": lookups_used,
                "app_name": app_name,
                "args": args,
                "user_id": user_id,
            },
        )

    def all_clear(self) -> None:
        """
        Delete all macro entries from the KV Store collection.

        Returns:
            The result of the delete operation.
        """
        return self.saia_macros_data.data.delete()

    def clear(
        self,
        title: str,
        definition: str,
        content: str,
        macros_used: List[str],
        updated_spl: str,
        datamodels_used: List[str],
        lookups_used: List[str],
        app_name: str,
        args: List[str],
        user_id: str,
    ) -> None:
        """
        Delete a specific macro entry matching all provided fields.

        Args:
            title: The macro name/title.
            definition: The original macro definition (SPL).
            content: JSON-serialized content metadata.
            macros_used: List of nested macro names used within this macro.
            updated_spl: The fully expanded SPL query with macros resolved.
            datamodels_used: List of datamodel names referenced in the macro.
            lookups_used: List of lookup names referenced in the macro.
            app_name: The Splunk app that owns this macro.
            args: List of argument names accepted by this macro.
            user_id: The user/role permissions for this macro.

        Returns:
            The result of the delete operation.
        """
        return self.saia_macros_data.data.delete(
            query=json.dumps(
                {
                    "title": title,
                    "definition": definition,
                    "content": content,
                    "macros_used": macros_used,
                    "updated_spl": updated_spl,
                    "datamodels_used": datamodels_used,
                    "lookups_used": lookups_used,
                    "app_name": app_name,
                    "args": args,
                    "user_id": user_id,
                }
            )
        )

    def batch_save(self, entries: List[Dict[str, Any]]) -> None:
        """
        Batch insert multiple macro entries into the KV Store.

        Args:
            entries: A list of macro dictionaries to insert.

        Returns:
            The result of the batch save operation.
        """
        return self.saia_macros_data.data.batch_save(*entries)
