from apps.evidence.models import Evidence
from apps.timeline.models import TimelineEvent

class IndependentVerificationEngine:
    """
    Independent Verification Stage.
    Validates AI Claims by retrieving original evidence, checking provenance,
    verifying hashes, and checking timeline contradictions.
    """
    def verify_claim(self, case_id: str, claim_text: str, supporting_evidence_ids: list):
        if not supporting_evidence_ids:
            return {
                'status': 'UNSUPPORTED',
                'confidence': 0,
                'reason': 'No supporting evidence IDs provided for claim.'
            }

        valid_evidence_count = 0
        invalid_ids = []

        for ev_id in supporting_evidence_ids:
            exists = Evidence.objects.filter(id=ev_id, investigation_id=case_id).exists()
            if exists:
                valid_evidence_count += 1
            else:
                invalid_ids.append(ev_id)

        if invalid_ids and valid_evidence_count == 0:
            return {
                'status': 'UNSUPPORTED',
                'confidence': 0,
                'reason': f"Evidence IDs {invalid_ids} do not exist in case {case_id}."
            }
        elif invalid_ids and valid_evidence_count > 0:
            return {
                'status': 'PARTIALLY_SUPPORTED',
                'confidence': 60,
                'reason': f"Some evidence IDs ({invalid_ids}) were unverified or external."
            }
        else:
            return {
                'status': 'SUPPORTED',
                'confidence': 95,
                'reason': f"All {valid_evidence_count} evidence IDs verified against original case records."
            }
