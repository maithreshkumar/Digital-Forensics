import unittest
from apps.verification.engine import IndependentVerificationEngine

class VerificationEngineTest(unittest.TestCase):
    def test_unsupported_claim(self):
        engine = IndependentVerificationEngine()
        res = engine.verify_claim(
            case_id="case-999",
            claim_text="Suspect logged in from malicious IP",
            supporting_evidence_ids=["ev-nonexistent"]
        )
        self.assertEqual(res['status'], 'UNSUPPORTED')
        self.assertEqual(res['confidence'], 0)

if __name__ == '__main__':
    unittest.main()
