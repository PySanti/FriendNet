from rest_framework import serializers

class NotificationsDeleteSerializer(serializers.Serializer):
    notification_id = serializers.IntegerField()