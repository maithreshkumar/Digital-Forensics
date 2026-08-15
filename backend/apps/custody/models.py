from django.db import models

class ChainOfCustody(models.Model):
    ACTION_CHOICES = [
        ('ACQUIRED', 'Acquired'),
        ('UPLOADED', 'Uploaded'),
        ('ACCESSED', 'Accessed'),
        ('COPIED', 'Copied'),
        ('PROCESSED', 'Processed'),
        ('HASH_VERIFIED', 'Hash Verified'),
        ('INTEGRITY_FAILURE', 'Integrity Failure'),
        ('EXPORTED', 'Exported'),
        ('REPORT_GENERATED', 'Report Generated'),
        ('collected', 'Collected'),
        ('transferred', 'Transferred'),
        ('analyzed', 'Analyzed'),
        ('verified', 'Verified'),
    ]

    id = models.CharField(max_length=64, primary_key=True)
    evidence_id = models.CharField(max_length=64, db_index=True)
    case_id = models.CharField(max_length=64, db_index=True, blank=True, default='')
    action = models.CharField(max_length=100, choices=ACTION_CHOICES, default='ACQUIRED')
    timestamp = models.DateTimeField(auto_now_add=True)
    actor = models.CharField(max_length=255, default='System')
    location = models.CharField(max_length=255, default='Secure Storage')
    hash = models.CharField(max_length=128, blank=True, default='')
    signature = models.TextField(blank=True, default='')
    notes = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'chain_of_custody'
        ordering = ['timestamp']

    def __str__(self):
        return f"[{self.timestamp}] {self.evidence_id} - {self.action} by {self.actor}"
