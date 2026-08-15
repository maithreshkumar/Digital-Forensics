from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HealthView, AuthLoginView, AuthMeView,
    InvestigationViewSet, EvidenceViewSet, AgentViewSet,
    NotificationViewSet, TimelineEventViewSet, FindingViewSet, ReportViewSet
)

router = DefaultRouter()
router.register(r'investigations', InvestigationViewSet, basename='investigation')
router.register(r'evidence', EvidenceViewSet, basename='evidence')
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'timeline', TimelineEventViewSet, basename='timeline')
router.register(r'findings', FindingViewSet, basename='finding')
router.register(r'reports', ReportViewSet, basename='report')

urlpatterns = [
    path('health/', HealthView.as_view(), name='health'),
    path('auth/login/', AuthLoginView.as_view(), name='auth_login'),
    path('auth/me/', AuthMeView.as_view(), name='auth_me'),
    path('', include(router.urls)),
]
