from django.db import models

class DFIRUser(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('investigator', 'Investigator'),
        ('analyst', 'Analyst'),
        ('viewer', 'Viewer'),
    ]

    id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255, blank=True, default='')
    role = models.CharField(max_length=50, default='admin')
    avatar = models.URLField(blank=True, default='')
    mfa_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'dfir_users'
        verbose_name = 'DFIR User'
        verbose_name_plural = 'DFIR Users'

    def __str__(self):
        return f"{self.name} ({self.role})"
