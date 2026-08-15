from django.db import models
from apps.accounts.models import DFIRUser

class Case(models.Model):
    PRIORITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('INVESTIGATING', 'Investigating'),
        ('REVIEW', 'Review'),
        ('CLOSED', 'Closed'),
        ('ARCHIVED', 'Archived'),
        ('planning', 'Planning'),
        ('collecting', 'Collecting'),
        ('processing', 'Processing'),
        ('analyzing', 'Analyzing'),
        ('reporting', 'Reporting'),
        ('complete', 'Complete'),
    ]

    id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=255)
    case_id = models.CharField(max_length=64, db_index=True)
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES, default='medium')
    type = models.CharField(max_length=100, default='general')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='planning')
    description = models.TextField(blank=True, default='')
    prompt = models.TextField(blank=True, default='')
    assigned_to = models.CharField(max_length=255, blank=True, default='')
    trust_score = models.IntegerField(default=90)
    confidence = models.IntegerField(default=85)
    progress = models.IntegerField(default=0)
    evidence_count = models.IntegerField(default=0)
    agents_active = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cases'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.case_id} — {self.name}"


class CaseMember(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(DFIRUser, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, default='investigator')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'case_members'
        unique_together = ('case', 'user')
