from rest_framework import viewsets
from rest_framework.response import Response
from .models import TimelineEvent
from .serializers import TimelineEventSerializer

class TimelineEventViewSet(viewsets.ModelViewSet):
    queryset = TimelineEvent.objects.all()
    serializer_class = TimelineEventSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        case_id = self.request.query_params.get('case_id') or self.request.query_params.get('investigationId')
        if case_id:
            qs = qs.filter(case_id=case_id)
        event_type = self.request.query_params.get('type')
        if event_type:
            qs = qs.filter(type=event_type)
        severity = self.request.query_params.get('severity')
        if severity:
            qs = qs.filter(severity=severity)
        return qs
