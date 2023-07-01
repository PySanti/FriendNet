from rest_framework import serializers
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
            "photo_link", 
            ]

class ActivateUserSerializer(serializers.Serializer):
    user_id=serializers.IntegerField()


class GetUserDetailSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=15)


class CheckExistingUserSerializer(GetUserDetailSerializer):
    email = serializers.EmailField()


class UpdateUsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = [
            "username", 
            "email", 
            "first_names", 
            "last_names", 
            "age", 
            "photo_link", 
            ]

