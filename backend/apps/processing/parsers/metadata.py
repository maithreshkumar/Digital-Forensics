from .base import BaseArtifactParser
import os
from datetime import datetime, timezone

class MetadataParser(BaseArtifactParser):
    parser_name = "MetadataParser"
    parser_version = "1.0.0"

    def parse(self, file_path_or_content):
        if not isinstance(file_path_or_content, str) or not os.path.exists(file_path_or_content):
            return [self.create_provenance("file_metadata", "local", {"file_size": 0, "status": "simulated"})]

        stat = os.stat(file_path_or_content)
        extracted = {
            "size": stat.st_size,
            "created_at": datetime.fromtimestamp(stat.st_ctime, tz=timezone.utc).isoformat(),
            "modified_at": datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).isoformat(),
            "accessed_at": datetime.fromtimestamp(stat.st_atime, tz=timezone.utc).isoformat(),
        }
        return [self.create_provenance("file_metadata", file_path_or_content, extracted)]
