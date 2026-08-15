from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({
        "name": "AI-Powered Autonomous Digital Forensics Investigator API",
        "status": "running",
        "version": "1.0.0",
        "api_v1_root": "/api/v1/",
        "api_legacy_root": "/api/",
        "health_check": "/api/health/"
    })

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/v1/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.cases.urls')),
    path('api/v1/', include('apps.evidence.urls')),
    path('api/v1/', include('apps.timeline.urls')),
    path('api/v1/', include('apps.findings.urls')),
    path('api/v1/', include('apps.reports.urls')),
    path('api/', include('api.urls')),
]
