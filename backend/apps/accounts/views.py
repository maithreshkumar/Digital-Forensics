from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DFIRUser
from .serializers import DFIRUserSerializer

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email', 'investigator@dfir.gov')
        user = DFIRUser.objects.filter(email=email).first()
        if not user:
            user = DFIRUser.objects.create(
                id='usr-001',
                name='Dr. Sarah Mitchell',
                email=email,
                role='admin',
                mfa_enabled=True
            )
        serializer = DFIRUserSerializer(user)
        return Response({
            'token': 'dfir-session-token-authenticated',
            'user': serializer.data
        }, status=status.HTTP_200_OK)

class UserMeView(APIView):
    def get(self, request):
        user = DFIRUser.objects.first()
        if not user:
            user = DFIRUser.objects.create(
                id='usr-001',
                name='Dr. Sarah Mitchell',
                email='investigator@dfir.gov',
                role='admin',
                mfa_enabled=True
            )
        return Response(DFIRUserSerializer(user).data)

class LogoutView(APIView):
    def post(self, request):
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
