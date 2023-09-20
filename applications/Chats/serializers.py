from rest_framework import serializers

# en un sistema de mensajería, siempre habrán dos usuarios: sender y receiver.
# el sender siempre sera el dueño de la sesión y accederemos a sus datos a traves
# de request.user

class BaseMessagesSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField()

class GetMessagesHistorialSerializer(BaseMessagesSerializer):
    pass

class SendMsgSerializer(BaseMessagesSerializer):
    msg = serializers.CharField()
    create_notification = serializers.BooleanField()

