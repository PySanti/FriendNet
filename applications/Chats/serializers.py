from rest_framework import serializers

class GetMessagesHistorialSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField()

class SendMsgSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField()
    msg = serializers.CharField()

