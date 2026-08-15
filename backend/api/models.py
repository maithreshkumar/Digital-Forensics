from apps.accounts.models import DFIRUser
from apps.cases.models import Case as Investigation
from apps.evidence.models import Evidence
from apps.timeline.models import TimelineEvent
from apps.findings.models import Finding
from apps.reports.models import ForensicReport as Report
from apps.custody.models import ChainOfCustody as CustodyEntry
from apps.audit.models import AuditLog
from django.db import models

class Agent(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='idle')
    current_task = models.TextField(blank=True, default='')
    progress = models.IntegerField(default=0)
    confidence = models.IntegerField(default=90)
    evidence_analyzed = models.IntegerField(default=0)
    findings = models.IntegerField(default=0)
    color = models.CharField(max_length=50, default='#2563eb')
    icon = models.CharField(max_length=50, default='Cpu')

    class Meta:
        db_table = 'agents'

    def __str__(self):
        return f"{self.name} ({self.status})"


class Notification(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50, default='info')
    time = models.CharField(max_length=100, blank=True, default='')
    read = models.BooleanField(default=False)
    investigation_id = models.CharField(max_length=64, blank=True, default='')

    class Meta:
        db_table = 'notifications'
