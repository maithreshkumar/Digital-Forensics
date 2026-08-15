from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Case
from .serializers import CaseSerializer
import uuid

class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if 'id' not in data:
            data['id'] = f"inv-{uuid.uuid4().hex[:6]}"
        if 'caseId' not in data and 'case_id' not in data:
            data['caseId'] = f"CASE-2026-{uuid.uuid4().hex[:4].upper()}"
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
