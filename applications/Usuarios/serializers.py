from rest_framework import serializers
from applications.Notifications.serializers import NotificationsSerializers
from .models import Usuarios
from .utils import USER_SHOWABLE_FIELDS


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
            "photo_link", 
            ]

class ActivateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = [
            "id"
        ]


class GetUserDetailSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=15)


class CheckExistingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model= Usuarios
        fields = [
            "username",
            "email"
        ]

