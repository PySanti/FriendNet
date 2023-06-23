from rest_framework import serializers
from applications.Notifications.serializers import NotificationsSerializers
from .models import Usuarios


class CreateUsuariosSerializer(serializers.ModelSerializer):
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
            ]
    def create(self, validated_data):
        new_user = Usuarios.objects.create_user(
            validated_data['username'],
            validated_data['password'],
            validated_data['email'],
            first_names     = validated_data['first_names'],
            last_names      = validated_data['last_names'],
            age             = validated_data['age'],
            photo           = validated_data['photo'],
        )
        return  new_user


