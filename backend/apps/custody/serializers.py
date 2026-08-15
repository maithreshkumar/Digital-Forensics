from rest_framework import serializers
from .models import ChainOfCustody

class CustodyEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChainOfCustody
        fields = ['id', 'action', 'timestamp', 'actor', 'location', 'hash', 'signature', 'notes']
