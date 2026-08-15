from django.db import models

class Evidence(models.Model):
    STATUS_CHOICES = [
        ('queued', 'Queued'),
        ('processing', 'Processing'),
        ('verified', 'Verified'),
        ('analyzed', 'Analyzed'),
        ('error', 'Error'),
        ('INTEGRITY_COMPROMISED', 'Integrity Compromised'),
    ]

    id = models.CharField(max_length=64, primary_key=True)
    investigation_id = models.CharField(max_length=64, db_index=True)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    size = models.BigIntegerField(default=0)
    hash_md5 = models.CharField(max_length=64, blank=True, default='')
    hash_sha256 = models.CharField(max_length=128, blank=True, default='')
    hash_sha512 = models.CharField(max_length=256, blank=True, default='')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    collected_by = models.CharField(max_length=255, blank=True, default='')
    trust_score = models.IntegerField(default=95)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='verified')
    metadata = models.JSONField(default=dict, blank=True)
    tags = models.JSONField(default=list, blank=True)
    file_path = models.CharField(max_length=512, blank=True, default='')

    class Meta:
        db_table = 'evidence'
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.name} ({self.type})"
