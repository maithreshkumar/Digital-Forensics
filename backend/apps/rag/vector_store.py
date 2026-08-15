import logging
import math
from typing import List, Dict, Any, Optional
from apps.rag.embeddings import get_embedding_provider, EmbeddingProvider

logger = logging.getLogger(__name__)

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    if not norm1 or not norm2:
        return 0.0
    return dot / (norm1 * norm2)


class CaseIsolatedVectorStore:
    """
    Case-Isolated Vector Search Engine with strict provenance and compromised evidence protection.
    Ensures that queries executed for Case A NEVER retrieve chunks from Case B.
    """
    def __init__(self, embedding_provider: Optional[EmbeddingProvider] = None):
        self.embedding_provider = embedding_provider or get_embedding_provider()
        # Storage partitioned strictly by case_id: { case_id: [chunk_records] }
        self._stores: Dict[str, List[Dict[str, Any]]] = {}

    def add_document_chunk(
        self,
        case_id: str,
        evidence_id: str,
        chunk_id: str,
        text: str,
        metadata: Optional[Dict[str, Any]] = None,
        embedding: Optional[List[float]] = None
    ) -> Dict[str, Any]:
        if not case_id:
            raise ValueError("case_id is required for vector storage indexing.")
        
        if case_id not in self._stores:
            self._stores[case_id] = []

        vector = embedding or self.embedding_provider.embed_text(text)

        item = {
            "chunk_id": chunk_id,
            "case_id": case_id,
            "evidence_id": evidence_id,
            "text": text,
            "embedding": vector,
            "dimension": len(vector),
            "metadata": metadata or {},
            "compromised": False
        }
        self._stores[case_id].append(item)
        logger.info(f"Indexed vector chunk {chunk_id} under case {case_id}")
        return item

    def mark_evidence_compromised(self, case_id: str, evidence_id: str):
        """
        Flags all chunks associated with compromised evidence so they are never returned to AI.
        """
        if case_id in self._stores:
            for item in self._stores[case_id]:
                if item["evidence_id"] == evidence_id:
                    item["compromised"] = True

    def search(
        self,
        case_id: str,
        query: str,
        top_k: int = 5,
        exclude_compromised: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Strictly case-isolated vector search.
        """
        if not case_id:
            raise ValueError("case_id is mandatory for vector search queries.")

        case_chunks = self._stores.get(case_id, [])
        if not case_chunks:
            return []

        # Filter out compromised chunks if required
        valid_chunks = [
            c for c in case_chunks
            if not (exclude_compromised and c.get("compromised", False))
        ]
        if not valid_chunks:
            return []

        # Compute query vector
        query_vector = self.embedding_provider.embed_text(query)

        scored = []
        query_words = set(query.lower().split())

        for chunk in valid_chunks:
            sim = cosine_similarity(query_vector, chunk.get("embedding", []))
            
            # Blend with lexical overlap for robust search
            text_words = set(chunk["text"].lower().split())
            overlap = len(query_words.intersection(text_words))
            lex_score = overlap / (len(query_words) or 1)
            
            final_score = (0.7 * sim) + (0.3 * lex_score)
            scored.append((final_score, chunk))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = [item for score, item in scored[:top_k]]
        return results

# Singleton instance
vector_store = CaseIsolatedVectorStore()
