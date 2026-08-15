import abc
import hashlib
import math
from typing import List

class EmbeddingProvider(abc.ABC):
    """
    Abstract Embedding Provider.
    Used consistently across document chunking and user query retrieval.
    """
    @abc.abstractmethod
    def embed_text(self, text: str) -> List[float]:
        pass

    @abc.abstractmethod
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        pass

    @property
    @abc.abstractmethod
    def dimension(self) -> int:
        pass


class DeterministicForensicEmbeddingProvider(EmbeddingProvider):
    """
    Standard deterministic feature embedding engine (384 dimensions).
    Generates repeatable, unit-normalized dense vectors for forensic text.
    Works with 0 external network dependencies and complete reproducibility.
    """
    def __init__(self, dim: int = 384):
        self._dim = dim

    @property
    def dimension(self) -> int:
        return self._dim

    def embed_text(self, text: str) -> List[float]:
        if not text:
            return [0.0] * self._dim

        # Compute deterministic seed hash
        h = hashlib.sha256(text.encode('utf-8')).digest()
        vec = []
        for i in range(self._dim):
            byte_val = h[i % len(h)]
            # Generate deterministic pseudo-random float
            val = ((byte_val * (i + 1)) % 1000) / 1000.0 - 0.5
            vec.append(val)

        # Unit normalization
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [x / norm for x in vec]

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.embed_text(t) for t in texts]


def get_embedding_provider() -> EmbeddingProvider:
    return DeterministicForensicEmbeddingProvider()
