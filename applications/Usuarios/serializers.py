from rest_framework import serializers
from .models import Usuarios
from django.core.files.uploadedfile import InMemoryUploadedFile


class BaseUsuariosSerializers(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    photo = serializers.SerializerMethodField('get_photo')
    def get_photo(self, obj):
        data = self.context['request']
        if ('photo' not in data):
            return None
        elif isinstance(data['photo'], InMemoryUploadedFile) or (isinstance(data['photo'], str)):
            return data['photo']

class CreateUsuariosSerializer(BaseUsuariosSerializers):
    password = serializers.CharField(required=True) 

class UpdateUsuariosSerializer(BaseUsuariosSerializers):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)



class ChangeEmailForActivationSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    new_email = serializers.EmailField()


class ActivateUserSerializer(serializers.Serializer):
    user_id=serializers.IntegerField()

class GetUserDetailSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=15)
    password = serializers.CharField()

class CheckExistingUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=15)
    email = serializers.EmailField()

class ChangeUserPwdSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()

class GetUsersListSerializer(serializers.Serializer):
    session_user_id = serializers.IntegerField()
    user_keyword = serializers.CharField(required=False)

class SendEmailSerializer(serializers.Serializer):
    user_email = serializers.EmailField()
    code = serializers.CharField()
    message = serializers.CharField()


class EnterChatSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField()
    related_notification_id = serializers.IntegerField(required=False)


class RecoveryPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    new_password = serializers.CharField(required=True)


