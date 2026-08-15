from rest_framework import serializers
from .models import (
    DFIRUser, Investigation, Evidence, Agent, Notification,
    TimelineEvent, Finding, AuditLog, Report, CustodyEntry
)

class DFIRUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DFIRUser
        fields = ['id', 'name', 'email', 'role', 'mfa_enabled', 'created_at']

class InvestigationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investigation
        fields = ['id', 'name', 'case_id', 'priority', 'type', 'status', 'description', 'prompt', 'created_at', 'updated_at', 'assigned_to', 'trust_score', 'confidence', 'progress', 'evidence_count', 'agents_active']

class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = ['id', 'investigation_id', 'name', 'type', 'size', 'hash_md5', 'hash_sha256', 'hash_sha512', 'uploaded_at', 'collected_by', 'trust_score', 'status', 'metadata', 'tags']

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class TimelineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineEvent
        fields = ['id', 'case_id', 'evidence_id', 'timestamp', 'type', 'description', 'source', 'actor', 'target', 'severity', 'metadata']

class FindingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finding
        fields = ['id', 'case_id', 'title', 'description', 'severity', 'confidence', 'evidence_refs', 'agent_id', 'timestamp', 'category', 'verified']

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ['id', 'timestamp', 'user_name', 'user_role', 'action', 'resource', 'details', 'ip_address', 'status']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'case_id', 'type', 'title', 'created_at', 'status', 'confidence', 'sections']

class CustodyEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustodyEntry
        fields = ['id', 'evidence_id', 'case_id', 'action', 'timestamp', 'actor', 'location', 'hash', 'signature', 'notes']
