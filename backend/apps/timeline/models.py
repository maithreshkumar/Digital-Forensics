from django.db import models

class TimelineEvent(models.Model):
    TYPE_CHOICES = [
        ('login', 'Login'),
        ('file-create', 'File Create'),
        ('file-delete', 'File Delete'),
        ('usb-event', 'USB Event'),
        ('registry-change', 'Registry Change'),
        ('browser', 'Browser Activity'),
        ('malware', 'Malware Execution'),
        ('cloud', 'Cloud Activity'),
        ('auth', 'Authentication'),
        ('network', 'Network Connection'),
        ('process', 'Process Creation'),
    ]

    SEVERITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
        ('info', 'Info'),
    ]

    id = models.CharField(max_length=64, primary_key=True)
    case_id = models.CharField(max_length=64, db_index=True)
    evidence_id = models.CharField(max_length=64, db_index=True, blank=True, default='')
    timestamp = models.CharField(max_length=100, db_index=True)
    timestamp_precision = models.CharField(max_length=50, default='exact')
    type = models.CharField(max_length=100, choices=TYPE_CHOICES, default='file-create')
    description = models.TextField()
    source = models.CharField(max_length=255, blank=True, default='')
    actor = models.CharField(max_length=255, blank=True, default='')
    target = models.CharField(max_length=255, blank=True, default='')
    severity = models.CharField(max_length=50, choices=SEVERITY_CHOICES, default='medium')
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'timeline_events'
        ordering = ['timestamp']

    def __str__(self):
        return f"[{self.timestamp}] {self.type} - {self.description[:50]}"
