import logging

from .constants import COLLECTION_NAME_SAIA_FIELD_SUMMARY_STATE

DEFAULT_KVSTORE_PAGE_SIZE = 1000


class SaiaFieldSummaryCollection:
    """
    Lightweight wrapper around KV store collection tracking last-sampled times for index/sourcetype pairs.
    """

    def __init__(self, service):
        try:
            self.logger = logging.Logger(self.__class__.__name__)
            self.saia_collection_data = service.kvstore[COLLECTION_NAME_SAIA_FIELD_SUMMARY_STATE]
        except KeyError:
            raise Exception("KVStore collection not found")

    def get(self, page_size=DEFAULT_KVSTORE_PAGE_SIZE):
        """
        Returns all documents in the collection using explicit limit/skip pagination.
        """
        if not isinstance(page_size, int) or page_size < 1:
            raise ValueError("KVStore page size must be a positive integer")

        records = []
        skip = 0

        while True:
            page = self.saia_collection_data.data.query(limit=page_size, skip=skip)
            records.extend(page)
            if len(page) < page_size:
                break
            skip += page_size

        return records

    def batch_save(self, entries):
        """Persist multiple KV store documents in a single batch save call."""
        # splunklib batch_save expects positional args
        return self.saia_collection_data.data.batch_save(*entries)

    def upsert(self, entry):
        """
        Upsert a single KV store document by _key.
        """
        key = entry.get("_key")
        if not key:
            raise ValueError("KVStore entry requires a non-empty _key")
        try:
            return self.saia_collection_data.data.update(key, entry)
        except Exception:
            return self.saia_collection_data.data.insert(entry)
