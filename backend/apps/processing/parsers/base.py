import abc
from datetime import datetime, timezone

class BaseArtifactParser(abc.ABC):
    parser_name = "BaseArtifactParser"
    parser_version = "1.0.0"

    def __init__(self, evidence_id, case_id):
        self.evidence_id = evidence_id
        self.case_id = case_id

    @abc.abstractmethod
    def parse(self, file_path_or_content):
        """Must return a list of extracted artifacts with evidence provenance."""
        pass

    def create_provenance(self, artifact_type, source_location, extracted_data):
        return {
            'evidence_id': self.evidence_id,
            'case_id': self.case_id,
            'parser_name': self.parser_name,
            'parser_version': self.parser_version,
            'artifact_type': artifact_type,
            'source_location': source_location,
            'extracted_data': extracted_data,
            'extracted_at': datetime.now(timezone.utc).isoformat()
        }
