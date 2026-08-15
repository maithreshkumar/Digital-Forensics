from rest_framework import viewsets
from .models import Finding
from .serializers import FindingSerializer

class FindingViewSet(viewsets.ModelViewSet):
    queryset = Finding.objects.all()
    serializer_class = FindingSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        case_id = self.request.query_params.get('case_id') or self.request.query_params.get('investigationId')
        if case_id:
            qs = qs.filter(case_id=case_id)
        return qs
