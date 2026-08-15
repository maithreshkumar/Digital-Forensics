import unittest
from apps.rag.vector_store import vector_store

class RAGCaseIsolationTest(unittest.TestCase):
    def test_case_isolation(self):
        # Index data in Case A
        vector_store.add_document_chunk(
            case_id="case-101",
            evidence_id="ev-101",
            chunk_id="chunk-1",
            text="Secret ransomware key found in memory dump."
        )

        # Index data in Case B
        vector_store.add_document_chunk(
            case_id="case-202",
            evidence_id="ev-202",
            chunk_id="chunk-2",
            text="Insider threat exfiltrated employee database."
        )

        # Search for ransomware in Case B -> Must return EMPTY (no leakage from Case A)
        results_case_b = vector_store.search(case_id="case-202", query="ransomware")
        self.assertEqual(len(results_case_b), 0)

        # Search for ransomware in Case A -> Must return chunk-1
        results_case_a = vector_store.search(case_id="case-101", query="ransomware")
        self.assertEqual(len(results_case_a), 1)
        self.assertEqual(results_case_a[0]["chunk_id"], "chunk-1")

if __name__ == '__main__':
    unittest.main()
