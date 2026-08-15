import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dfir_backend.settings')
try:
    django.setup()
except Exception:
    pass
