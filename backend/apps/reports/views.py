from rest_framework import viewsets
from .models import ForensicReport
from .serializers import ReportSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = ForensicReport.objects.all()
    serializer_class = ReportSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        case_id = self.request.query_params.get('case_id') or self.request.query_params.get('investigationId')
        if case_id:
            qs = qs.filter(case_id=case_id)
        return qs
