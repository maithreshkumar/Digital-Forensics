from rest_framework import serializers
from .models import Finding

class FindingSerializer(serializers.ModelSerializer):
    evidenceRefs = serializers.JSONField(source='evidence_refs', default=list)
    agentId = serializers.CharField(source='agent_id', required=False, allow_blank=True)

    class Meta:
        model = Finding
        fields = [
            'id', 'title', 'description', 'severity', 'confidence',
            'evidenceRefs', 'agentId', 'timestamp', 'category', 'verified'
        ]
