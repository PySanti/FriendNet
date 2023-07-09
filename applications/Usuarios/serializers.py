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

class ChangeUserPwdSerializer(serializers.Serializer):
    username = serializers.CharField()
    old_password = serializers.CharField()
    new_password = serializers.CharField()

class GetUsersListSerializer(serializers.Serializer):
    session_user_id = serializers.IntegerField()

class GetChatBetweenSerializer(serializers.Serializer):
    id_1 = serializers.IntegerField()
    id_2 = serializers.IntegerField()

class SendMsgSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField()
    sender_id = serializers.IntegerField()
    msg = serializers.CharField()

class RemoveNotificationSerializer(serializers.Serializer):
    notification_id = serializers.IntegerField()
