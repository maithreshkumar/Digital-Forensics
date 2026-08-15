import logging
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import connection

from .models import (
    DFIRUser, Investigation, Evidence, Agent, Notification,
    TimelineEvent, Finding, AuditLog, Report, CustodyEntry
)
from .serializers import (
    DFIRUserSerializer, InvestigationSerializer, EvidenceSerializer,
    AgentSerializer, NotificationSerializer, TimelineEventSerializer,
    FindingSerializer, AuditLogSerializer, ReportSerializer, CustodyEntrySerializer
)
from app.data.seed import get_seed_data

logger = logging.getLogger(__name__)

def check_mysql_connection():
    try:
        connection.ensure_connection()
        return True
    except Exception as e:
        logger.warning(f"MySQL connection check failed: {e}")
        return False


class HealthView(APIView):
    def get(self, request):
        db_ok = check_mysql_connection()
        return Response({
            "status": "healthy" if db_ok else "degraded",
            "database": "MySQL local root connection" if db_ok else "In-memory fallback (MySQL offline)",
            "mysql_connected": db_ok,
            "version": "1.0.0"
        })


class AuthLoginView(APIView):
    def post(self, request):
        email = request.data.get("email", "investigator@dfir.gov")
        db_ok = check_mysql_connection()
        if db_ok:
            try:
                user = DFIRUser.objects.filter(email=email).first()
                if user:
                    return Response({
                        "token": "dfir-session-token-local-mysql",
                        "user": DFIRUserSerializer(user).data
                    })
            except Exception as e:
                logger.warning(f"Error querying user from MySQL: {e}")

        # Fallback response
        seed = get_seed_data()
        users = seed.get("users", [])
        matched = next((u for u in users if u["email"] == email), users[0])
        return Response({
            "token": "dfir-session-token-local-fallback",
            "user": matched
        })


class AuthMeView(APIView):
    def get(self, request):
        db_ok = check_mysql_connection()
        if db_ok:
            try:
                user = DFIRUser.objects.first()
                if user:
                    return Response(DFIRUserSerializer(user).data)
            except Exception as e:
                logger.warning(f"Error reading user: {e}")

        seed = get_seed_data()
        return Response(seed["users"][0])


class InvestigationViewSet(viewsets.ModelViewSet):
    queryset = Investigation.objects.all()
    serializer_class = InvestigationSerializer

    def list(self, request, *args, **kwargs):
        if check_mysql_connection():
            try:
                return super().list(request, *args, **kwargs)
            except Exception as e:
                logger.warning(f"MySQL investigation list error: {e}")
        return Response(get_seed_data()["investigations"])


class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer

    def list(self, request, *args, **kwargs):
        if check_mysql_connection():
            try:
                return super().list(request, *args, **kwargs)
            except Exception as e:
                logger.warning(f"MySQL evidence list error: {e}")
        return Response(get_seed_data()["evidence"])


class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer

    def list(self, request, *args, **kwargs):
        if check_mysql_connection():
            try:
                return super().list(request, *args, **kwargs)
            except Exception as e:
                logger.warning(f"MySQL agent list error: {e}")
        return Response(get_seed_data()["agents"])


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def list(self, request, *args, **kwargs):
        if check_mysql_connection():
            try:
                return super().list(request, *args, **kwargs)
            except Exception as e:
                logger.warning(f"MySQL notification list error: {e}")
        return Response(get_seed_data()["notifications"])


class TimelineEventViewSet(viewsets.ModelViewSet):
    queryset = TimelineEvent.objects.all()
    serializer_class = TimelineEventSerializer

    def list(self, request, *args, **kwargs):
        if check_mysql_connection():
            try:
                return super().list(request, *args, **kwargs)
            except Exception as e:
                logger.warning(f"MySQL timeline list error: {e}")
        return Response(get_seed_data()["timeline_events"])


class FindingViewSet(viewsets.ModelViewSet):
    queryset = Finding.objects.all()
    serializer_class = FindingSerializer

    def list(self, request, *args, **kwargs):
        if check_mysql_connection():
            try:
                return super().list(request, *args, **kwargs)
            except Exception as e:
                logger.warning(f"MySQL finding list error: {e}")
        return Response(get_seed_data()["findings"])


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def list(self, request, *args, **kwargs):
        if check_mysql_connection():
            try:
                return super().list(request, *args, **kwargs)
            except Exception as e:
                logger.warning(f"MySQL report list error: {e}")
        return Response(get_seed_data()["reports"])
