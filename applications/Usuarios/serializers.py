from rest_framework import serializers
from .models import Usuarios


class CreateUsuariosSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    first_names = serializers.CharField()
    last_names = serializers.CharField()
    age = serializers.IntegerField()
    photo = serializers.FileField()

class UpdateUsuariosSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    first_names = serializers.CharField(required=False)
    last_names = serializers.CharField(required=False)
    age = serializers.IntegerField(required=False)
    photo = serializers.FileField(required=False)




class ActivateUserSerializer(serializers.Serializer):
    user_id=serializers.IntegerField()
class GetUserDetailSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=15)
    password = serializers.CharField()
class CheckExistingUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=15)
    email = serializers.EmailField()
class ChangeUserPwdSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    old_password = serializers.CharField()
    new_password = serializers.CharField()
class GetUsersListSerializer(serializers.Serializer):
    session_user_id = serializers.IntegerField()
class DisconnectUserSerializer(GetUsersListSerializer):
    pass
