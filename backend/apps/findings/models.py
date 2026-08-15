from django.db import models

class Finding(models.Model):
    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
        ('info', 'Info'),
    ]

    id = models.CharField(max_length=64, primary_key=True)
    case_id = models.CharField(max_length=64, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    severity = models.CharField(max_length=50, choices=SEVERITY_CHOICES, default='medium')
    confidence = models.IntegerField(default=90)
    evidence_refs = models.JSONField(default=list, blank=True)
    agent_id = models.CharField(max_length=64, blank=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=100, blank=True, default='')
    verified = models.BooleanField(default=False)

    class Meta:
        db_table = 'findings'
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.severity}] {self.title}"
