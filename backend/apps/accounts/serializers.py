from rest_framework import serializers
from .models import DFIRUser

class DFIRUserSerializer(serializers.ModelSerializer):
    mfaEnabled = serializers.BooleanField(source='mfa_enabled')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = DFIRUser
        fields = ['id', 'name', 'email', 'role', 'avatar', 'mfaEnabled', 'createdAt']
