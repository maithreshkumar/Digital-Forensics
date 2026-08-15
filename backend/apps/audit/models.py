from django.db import models

class AuditLog(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    user_name = models.CharField(max_length=255, default='System')
    user_role = models.CharField(max_length=50, default='investigator')
    action = models.CharField(max_length=255)
    resource = models.CharField(max_length=255)
    details = models.TextField(blank=True, default='')
    ip_address = models.CharField(max_length=50, default='127.0.0.1')
    status = models.CharField(max_length=50, default='success')

    class Meta:
        db_table = 'audit_logs'
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp}] {self.user_name} - {self.action} on {self.resource}"
