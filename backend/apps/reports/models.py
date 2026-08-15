from django.db import models

class ForensicReport(models.Model):
    TYPE_CHOICES = [
        ('executive', 'Executive Summary'),
        ('technical', 'Technical Report'),
        ('legal', 'Legal / Chain of Custody Report'),
    ]

    STATUS_CHOICES = [
        ('generating', 'Generating'),
        ('complete', 'Complete'),
        ('error', 'Error'),
    ]

    id = models.CharField(max_length=64, primary_key=True)
    case_id = models.CharField(max_length=64, db_index=True)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='technical')
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='complete')
    confidence = models.IntegerField(default=95)
    sections = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = 'forensic_reports'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.type})"
