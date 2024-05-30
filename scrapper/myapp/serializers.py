from rest_framework import serializers
from .models import NewsScanResult, WebsiteContent

class NewsScanResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsScanResult
        fields = '__all__'

class WebsiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteContent
        fields = '__all__'