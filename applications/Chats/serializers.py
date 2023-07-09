from rest_framework import serializers

class GetChatBetweenSerializer(serializers.Serializer):
    id_1 = serializers.IntegerField()
    id_2 = serializers.IntegerField()

class SendMsgSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField()
    sender_id = serializers.IntegerField()
    msg = serializers.CharField()

