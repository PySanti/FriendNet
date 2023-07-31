from rest_framework import serializers
from .models import Usuarios
from django.core.files.uploadedfile import InMemoryUploadedFile

class ChangeEmailForActivationSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    new_email = serializers.EmailField()

class BaseUsuariosSerializers(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField('get_photo')
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
    def get_photo(self, obj):
        data = self.context['request']
        if ('photo' not in data):
            return None
        elif isinstance(data['photo'], InMemoryUploadedFile) or (isinstance(data['photo'], str)):
            return data['photo']

class CreateUsuariosSerializer(BaseUsuariosSerializers):
    pass

class UpdateUsuariosSerializer(BaseUsuariosSerializers):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    first_names = serializers.CharField(required=False)
    last_names = serializers.CharField(required=False)
    age = serializers.IntegerField(required=False)
    password = serializers.CharField(required=False) # este campo nunca se usara




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
    user_keyword = serializers.CharField(required=False)
class DisconnectUserSerializer(GetUsersListSerializer):
    pass

class SendActivationEmailSerializer(serializers.Serializer):
    username = serializers.CharField()
    user_email = serializers.EmailField()
    activation_code = serializers.IntegerField()
