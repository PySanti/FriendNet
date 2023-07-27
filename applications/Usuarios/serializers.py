from rest_framework import serializers
from .models import Usuarios
from django.core.files.uploadedfile import InMemoryUploadedFile


class CreateUsuariosSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(max_length=None, use_url=None, required=False)
    class Meta:
        model = Usuarios
        fields = [
            "username",
            "email",
            "first_names",
            "last_names",
            "age",
            "password",
            "photo"
        ]

class UpdateUsuariosSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    first_names = serializers.CharField(required=False)
    last_names = serializers.CharField(required=False)
    age = serializers.IntegerField(required=False)
    photo = serializers.SerializerMethodField('get_photo')

    def get_photo(self, obj):
        data = self.context['request']
        if ('photo' not in data):
            return None
        elif isinstance(data['photo'], InMemoryUploadedFile):
            return data['photo']
        elif isinstance(data['photo'], str):
            return data['photo']




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
