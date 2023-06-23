from rest_framework import serializers
from applications.Notifications.serializers import NotificationsSerializers
from .models import Usuarios
from .tools import (
    sendActivationCodeEmail
)

class CreateUsuariosSerializer(serializers.ModelSerializer):
    is_staff = serializers.BooleanField(read_only=True, default=False)
    is_online = serializers.BooleanField(read_only=True, default=False)
    is_active = serializers.BooleanField(read_only=True, default=True)
    activation_code = serializers.BooleanField(read_only=True, default=False)
    notifications = NotificationsSerializers(many=True, default=[])

    class Meta:
        model = Usuarios
        fields = [
            "username", 
            "email", 
            "password",
            "first_names", 
            "last_names", 
            "age", 
            "photo", 
            "is_staff",
            "is_online",
            "is_active",
            "activation_code",
            "notifications",
            ]
    def create(self, validated_data):
        code = sendActivationCodeEmail(validated_data['username'], validated_data['email'])
        new_user = Usuarios.objects.create_user(
            validated_data['username'],
            validated_data['password'],
            validated_data['email'],
            first_names     = validated_data['first_names'],
            last_names      = validated_data['last_names'],
            age             = validated_data['age'],
            photo           = validated_data['photo'],
            activation_code = code ,
        )
        return  new_user


