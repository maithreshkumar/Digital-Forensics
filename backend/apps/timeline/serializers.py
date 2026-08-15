from rest_framework import serializers
from .models import TimelineEvent

class TimelineEventSerializer(serializers.ModelSerializer):
    evidenceId = serializers.CharField(source='evidence_id', required=False, allow_blank=True)

    class Meta:
        model = TimelineEvent
        fields = [
            'id', 'timestamp', 'type', 'description', 'source',
            'severity', 'evidenceId', 'actor', 'target', 'metadata'
        ]
