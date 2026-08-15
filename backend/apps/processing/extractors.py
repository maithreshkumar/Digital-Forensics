import os
import json
import csv
import logging

logger = logging.getLogger(__name__)

class ForensicExtractor:
    """
    Safe file content extractor. Treat all inputs as untrusted data.
    """
    @staticmethod
    def extract_content(file_path: str, mime_type: str = "") -> dict:
        if not os.path.exists(file_path):
            return {"text": "", "metadata": {}, "error": "File not found"}

        ext = os.path.splitext(file_path)[1].lower()
        extracted_text = ""
        metadata = {
            "file_size": os.path.getsize(file_path),
            "extension": ext,
            "filename": os.path.basename(file_path)
        }

        try:
            if ext in ['.txt', '.log', '.evtx_txt', '.conf']:
                with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                    extracted_text = f.read()

            elif ext == '.json':
                with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                    data = json.load(f)
                    extracted_text = json.dumps(data, indent=2)
                    metadata['json_keys'] = list(data.keys()) if isinstance(data, dict) else []

            elif ext == '.csv':
                rows = []
                with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                    reader = csv.reader(f)
                    for idx, row in enumerate(reader):
                        if idx < 1000:  # Bound memory footprint
                            rows.append(" | ".join(row))
                extracted_text = "\n".join(rows)

            elif ext == '.pdf':
                # Safe plain-text/binary representation fallback
                with open(file_path, 'rb') as f:
                    raw = f.read(50000)
                    extracted_text = f"[PDF Document: {os.path.basename(file_path)}, {len(raw)} bytes scanned]"

            elif ext in ['.docx', '.doc']:
                extracted_text = f"[DOCX Forensic Artifact: {os.path.basename(file_path)}]"

            else:
                # Default generic text extraction
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    extracted_text = f.read(100000)

        except Exception as e:
            logger.error(f"Error extracting content from {file_path}: {e}")
            return {"text": "", "metadata": metadata, "error": str(e)}

        return {
            "text": extracted_text,
            "metadata": metadata,
            "error": None
        }
