from rest_framework import serializers
from .models import ForensicReport

class ReportSerializer(serializers.ModelSerializer):
    investigationId = serializers.CharField(source='case_id')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = ForensicReport
        fields = ['id', 'investigationId', 'type', 'title', 'createdAt', 'status', 'confidence', 'sections']
