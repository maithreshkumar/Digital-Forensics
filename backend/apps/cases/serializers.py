from rest_framework import serializers
from .models import Case

class CaseSerializer(serializers.ModelSerializer):
    caseId = serializers.CharField(source='case_id')
    assignedTo = serializers.CharField(source='assigned_to', required=False, allow_blank=True)
    trustScore = serializers.IntegerField(source='trust_score', default=90)
    evidenceCount = serializers.IntegerField(source='evidence_count', default=0)
    agentsActive = serializers.IntegerField(source='agents_active', default=0)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Case
        fields = [
            'id', 'name', 'caseId', 'priority', 'type', 'status',
            'description', 'prompt', 'assignedTo', 'trustScore',
            'confidence', 'progress', 'evidenceCount', 'agentsActive',
            'createdAt', 'updatedAt'
        ]
