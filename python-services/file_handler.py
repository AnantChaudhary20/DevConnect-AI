import json
from pathlib import Path

from exceptions import StorageError


class JsonFileStore:
    """Small JSON persistence layer demonstrating safe file handling."""

    def __init__(self, path):
        self.path = Path(path)

    def read(self, default=None):
        if not self.path.exists():
            return default if default is not None else []

        try:
            with self.path.open("r", encoding="utf-8") as file:
                return json.load(file)
        except (OSError, json.JSONDecodeError) as exc:
            raise StorageError(f"Unable to read {self.path}") from exc

    def write(self, data):
        try:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            temp_path = self.path.with_suffix(".tmp")
            with temp_path.open("w", encoding="utf-8") as file:
                json.dump(data, file, indent=2)
            temp_path.replace(self.path)
        except OSError as exc:
            raise StorageError(f"Unable to write {self.path}") from exc

    def append(self, item, limit=100):
        records = self.read([])
        if not isinstance(records, list):
            records = []
        records.append(item)
        self.write(records[-limit:])
