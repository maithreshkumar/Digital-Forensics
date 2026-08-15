import io
import unittest
from apps.evidence.services import compute_file_hashes

class EvidenceHashingTest(unittest.TestCase):
    def test_chunked_hashing(self):
        sample_data = b"DFIR Forensic Test Evidence Content 2026"
        buf = io.BytesIO(sample_data)
        hashes = compute_file_hashes(buf)
        
        self.assertIn('md5', hashes)
        self.assertIn('sha256', hashes)
        self.assertIn('sha512', hashes)
        self.assertEqual(len(hashes['sha256']), 64)
        self.assertEqual(len(hashes['sha512']), 128)

if __name__ == '__main__':
    unittest.main()
