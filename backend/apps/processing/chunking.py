import hashlib
from typing import List, Dict, Any

class ForensicChunker:
    """
    Splits extracted evidence content into meaningful retrieval units while preserving full forensic provenance.
    """
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(
        self,
        text: str,
        case_id: str,
        evidence_id: str,
        artifact_id: str = "",
        source_name: str = "",
        extraction_method: str = "text"
    ) -> List[Dict[str, Any]]:
        if not text:
            return []

        words = text.split()
        chunks = []
        step = max(1, self.chunk_size - self.chunk_overlap)

        for i in range(0, len(words), step):
            chunk_words = words[i:i + self.chunk_size]
            chunk_content = " ".join(chunk_words)
            chunk_hash = hashlib.sha256(chunk_content.encode('utf-8')).hexdigest()
            chunk_id = f"chk-{evidence_id}-{i // step:04d}"

            chunks.append({
                "chunk_id": chunk_id,
                "chunk_index": i // step,
                "case_id": case_id,
                "evidence_id": evidence_id,
                "artifact_id": artifact_id or chunk_id,
                "source_name": source_name,
                "content": chunk_content,
                "content_hash": chunk_hash,
                "extraction_method": extraction_method,
                "word_count": len(chunk_words),
                "metadata": {
                    "source_offset": i,
                    "length": len(chunk_content)
                }
            })

        return chunks

default_chunker = ForensicChunker()
