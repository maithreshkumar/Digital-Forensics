from rest_framework import serializers
from .models import Evidence
from apps.custody.models import ChainOfCustody
from apps.custody.serializers import CustodyEntrySerializer

class EvidenceSerializer(serializers.ModelSerializer):
    hash = serializers.SerializerMethodField()
    uploadedAt = serializers.DateTimeField(source='uploaded_at', read_only=True)
    collectedBy = serializers.CharField(source='collected_by', required=False, allow_blank=True)
    trustScore = serializers.IntegerField(source='trust_score', default=95)
    investigationId = serializers.CharField(source='investigation_id')
    chainOfCustody = serializers.SerializerMethodField()

    class Meta:
        model = Evidence
        fields = [
            'id', 'name', 'type', 'size', 'hash', 'uploadedAt',
            'collectedBy', 'trustScore', 'status', 'metadata',
            'chainOfCustody', 'investigationId', 'tags'
        ]

    def get_hash(self, obj):
        return {
            'md5': obj.hash_md5,
            'sha256': obj.hash_sha256,
            'sha512': obj.hash_sha512
        }

    def get_chainOfCustody(self, obj):
        entries = ChainOfCustody.objects.filter(evidence_id=obj.id)
        return CustodyEntrySerializer(entries, many=True).data
