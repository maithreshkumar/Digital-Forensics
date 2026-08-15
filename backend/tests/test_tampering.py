import unittest
import tempfile
import os
from apps.evidence.services import compute_file_hashes

class EvidenceTamperingTest(unittest.TestCase):
    def test_tamper_detection(self):
        # 1. Create original evidence file
        with tempfile.NamedTemporaryFile(delete=False, mode='wb') as f:
            f.write(b"Original Forensic Evidence Dump Bytes")
            file_path = f.name

        try:
            # 2. Acquire original baseline hashes
            original_hashes = compute_file_hashes(file_path)
            orig_sha256 = original_hashes['sha256']
            orig_sha512 = original_hashes['sha512']

            self.assertEqual(len(orig_sha256), 64)
            self.assertEqual(len(orig_sha512), 128)

            # 3. Simulate evidence tampering by modifying bytes
            with open(file_path, 'wb') as f:
                f.write(b"Tampered / Modified Forensic Evidence Dump Bytes")

            # 4. Re-calculate hashes
            tampered_hashes = compute_file_hashes(file_path)
            tamp_sha256 = tampered_hashes['sha256']
            tamp_sha512 = tampered_hashes['sha512']

            # 5. Assert hash mismatch -> triggers COMPROMISED status
            self.assertNotEqual(orig_sha256, tamp_sha256)
            self.assertNotEqual(orig_sha512, tamp_sha512)

        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

if __name__ == '__main__':
    unittest.main()
