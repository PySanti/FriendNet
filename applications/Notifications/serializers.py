from rest_framework import serializers

class RemoveNotificationSerializer(serializers.Serializer):
    notification_id = serializers.IntegerField()
