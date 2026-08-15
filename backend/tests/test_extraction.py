import unittest
import tempfile
import os
from apps.processing.extractors import ForensicExtractor
from apps.processing.chunking import default_chunker

class ExtractionAndChunkingTest(unittest.TestCase):
    def test_text_extraction_and_chunking(self):
        sample_log = "2026-08-14 10:00:00 [AUTH] User root logged in from 192.168.1.50\n" * 50
        with tempfile.NamedTemporaryFile(delete=False, mode='w', suffix='.log', encoding='utf-8') as f:
            f.write(sample_log)
            file_path = f.name

        try:
            # 1. Extraction test
            result = ForensicExtractor.extract_content(file_path)
            self.assertIsNone(result["error"])
            self.assertIn("192.168.1.50", result["text"])

            # 2. Chunking test
            chunks = default_chunker.chunk_text(
                text=result["text"],
                case_id="case-001",
                evidence_id="ev-001",
                source_name="auth.log"
            )
            self.assertGreater(len(chunks), 0)
            self.assertEqual(chunks[0]["case_id"], "case-001")
            self.assertEqual(chunks[0]["evidence_id"], "ev-001")
            self.assertIn("content_hash", chunks[0])

        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

if __name__ == '__main__':
    unittest.main()
