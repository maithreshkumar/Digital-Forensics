from django.db import models

class ProcessingJob(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('complete', 'Complete'),
        ('error', 'Error'),
    ]

    job_id = models.CharField(max_length=64, primary_key=True)
    case_id = models.CharField(max_length=64, db_index=True)
    evidence_id = models.CharField(max_length=64, db_index=True, blank=True, default='')
    job_type = models.CharField(max_length=100, default='artifact_extraction')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    progress = models.IntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'processing_jobs'
        ordering = ['-started_at']

    def __str__(self):
        return f"Job {self.job_id} ({self.job_type}) - {self.status}"
