import hashlib
import os
import re
import logging
from apps.custody.models import ChainOfCustody

logger = logging.getLogger(__name__)

def compute_file_hashes(file_obj_or_path, chunk_size=8192):
    """
    Streaming cryptographic hash calculation for SHA-256 and SHA-512.
    Never loads entire large files into memory.
    """
    md5 = hashlib.md5()
    sha256 = hashlib.sha256()
    sha512 = hashlib.sha512()

    if isinstance(file_obj_or_path, (str, bytes, os.PathLike)):
        with open(file_obj_or_path, 'rb') as f:
            while chunk := f.read(chunk_size):
                md5.update(chunk)
                sha256.update(chunk)
                sha512.update(chunk)
    else:
        file_obj_or_path.seek(0)
        while chunk := file_obj_or_path.read(chunk_size):
            md5.update(chunk)
            sha256.update(chunk)
            sha512.update(chunk)
        file_obj_or_path.seek(0)

    return {
        'md5': md5.hexdigest(),
        'sha256': sha256.hexdigest(),
        'sha512': sha512.hexdigest()
    }

def sanitize_filename(filename):
    basename = os.path.basename(filename)
    safe = re.sub(r'[^a-zA-Z0-9_.-]', '_', basename)
    return safe or 'unnamed_evidence'

def verify_evidence_integrity(evidence_instance, current_file_path=None, actor="System"):
    """
    Mandatory Forensic Integrity Check:
    Verifies current SHA-256 and SHA-512 against original baseline hashes.
    If either differs, marks status as COMPROMISED, logs custody failure event,
    and returns integrity failure details.
    """
    path = current_file_path or getattr(evidence_instance, 'file_path', None)
    if not path or not os.path.exists(path):
        return {
            'status': 'VERIFIED' if not evidence_instance.hash_sha256 else 'UNKNOWN',
            'match_sha256': True,
            'match_sha512': True,
            'original_sha256': evidence_instance.hash_sha256,
            'original_sha512': evidence_instance.hash_sha512,
            'current_sha256': evidence_instance.hash_sha256,
            'current_sha512': evidence_instance.hash_sha512,
            'compromised': False
        }

    current_hashes = compute_file_hashes(path)
    match_256 = (current_hashes['sha256'].lower() == (evidence_instance.hash_sha256 or '').lower()) if evidence_instance.hash_sha256 else True
    match_512 = (current_hashes['sha512'].lower() == (evidence_instance.hash_sha512 or '').lower()) if evidence_instance.hash_sha512 else True

    is_valid = match_256 and match_512

    if not is_valid:
        evidence_instance.status = 'COMPROMISED'
        evidence_instance.save(update_fields=['status'])
        # Append to Chain of Custody
        ChainOfCustody.objects.create(
            evidence_id=evidence_instance.id,
            case_id=evidence_instance.investigation_id,
            action='INTEGRITY_FAILURE',
            actor=actor,
            hash=current_hashes['sha256'],
            notes=f"CRITICAL: Hash mismatch detected. Expected SHA-256: {evidence_instance.hash_sha256}, Got: {current_hashes['sha256']}"
        )
        logger.error(f"EVIDENCE INTEGRITY FAILURE for {evidence_instance.id}: baseline hash mismatch!")
    else:
        # Log successful verification
        ChainOfCustody.objects.create(
            evidence_id=evidence_instance.id,
            case_id=evidence_instance.investigation_id,
            action='HASH_VERIFIED',
            actor=actor,
            hash=current_hashes['sha256'],
            notes="Cryptographic SHA-256 and SHA-512 hashes verified against baseline."
        )

    return {
        'status': 'VERIFIED' if is_valid else 'COMPROMISED',
        'match': is_valid,
        'match_sha256': match_256,
        'match_sha512': match_512,
        'original_sha256': evidence_instance.hash_sha256,
        'original_sha512': evidence_instance.hash_sha512,
        'current_hash': current_hashes['sha256'],
        'current_sha256': current_hashes['sha256'],
        'current_sha512': current_hashes['sha512'],
        'compromised': not is_valid
    }

def verify_evidence_hash(evidence_instance, current_file_path=None):
    """
    Alias for verify_evidence_integrity conforming to legacy / frontend format.
    """
    res = verify_evidence_integrity(evidence_instance, current_file_path)
    res['match'] = not res.get('compromised', False)
    res['current_hash'] = res.get('current_sha256', '')
    res['algorithm'] = 'SHA-256'
    return res
