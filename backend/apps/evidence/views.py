from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Evidence
from .serializers import EvidenceSerializer
from .services import verify_evidence_hash
from apps.custody.models import ChainOfCustody
import uuid

class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if 'id' not in data:
            data['id'] = f"ev-{uuid.uuid4().hex[:6]}"
        if 'investigationId' in data and 'investigation_id' not in data:
            data['investigation_id'] = data['investigationId']

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        evidence = serializer.save()

        # Record append-only chain of custody entry
        ChainOfCustody.objects.create(
            id=f"cust-{uuid.uuid4().hex[:6]}",
            evidence_id=evidence.id,
            case_id=evidence.investigation_id,
            action='ACQUIRED',
            actor=evidence.collected_by or 'System User',
            location='DFIR Evidence Repository',
            hash=evidence.hash_sha256,
            notes='Evidence ingested and registered with cryptographic hash.'
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='verify')
    def verify_integrity(self, request, pk=None):
        evidence = self.get_object()
        verification_result = verify_evidence_hash(evidence)
        
        # Log to append-only custody chain
        action_type = 'HASH_VERIFIED' if verification_result['match'] else 'INTEGRITY_FAILURE'
        if not verification_result['match']:
            evidence.status = 'INTEGRITY_COMPROMISED'
            evidence.save()

        ChainOfCustody.objects.create(
            id=f"cust-{uuid.uuid4().hex[:6]}",
            evidence_id=evidence.id,
            case_id=evidence.investigation_id,
            action=action_type,
            actor=request.user.username if getattr(request, 'user', None) and request.user.is_authenticated else 'Investigator',
            location='Forensic Workstation',
            hash=verification_result['current_hash'],
            notes=f"Integrity check completed. Match: {verification_result['match']}."
        )

        return Response(verification_result, status=status.HTTP_200_OK)
