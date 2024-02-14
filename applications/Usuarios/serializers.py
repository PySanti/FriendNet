from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from .utils.constants import (BASE_USERNAME_MAX_LENGTH, BASE_EMAIL_MAX_LENGTH, BASE_PASSWORD_MAX_LENGTH, BASE_SECURITY_CODE_MAX_LENGTH)

class BaseUsuariosSerializers(serializers.Serializer):
    username = serializers.CharField(max_length=BASE_USERNAME_MAX_LENGTH)
    email = serializers.EmailField(max_length=BASE_EMAIL_MAX_LENGTH)
    photo = serializers.SerializerMethodField('get_photo')
    def get_photo(self, obj):
        data = self.context['request']
        if ('photo' not in data):
            return None
        elif isinstance(data['photo'], InMemoryUploadedFile) or (isinstance(data['photo'], str)):
            return data['photo']

class CreateUsuariosSerializer(BaseUsuariosSerializers):
    password = serializers.CharField(max_length=BASE_PASSWORD_MAX_LENGTH) 

class UpdateUsuariosSerializer(BaseUsuariosSerializers):
    username = serializers.CharField(required=False, max_length=BASE_USERNAME_MAX_LENGTH)
    email = serializers.EmailField(max_length=BASE_EMAIL_MAX_LENGTH)



class ChangeEmailForActivationSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    new_email = serializers.EmailField(max_length=BASE_EMAIL_MAX_LENGTH)


class ActivateUserSerializer(serializers.Serializer):
    user_id=serializers.IntegerField()

class GetUserDetailSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=BASE_USERNAME_MAX_LENGTH)
    password = serializers.CharField(max_length=BASE_PASSWORD_MAX_LENGTH)

class CheckExistingUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=BASE_USERNAME_MAX_LENGTH)
    email = serializers.EmailField(max_length=BASE_EMAIL_MAX_LENGTH)

class ChangeUserPwdSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=BASE_PASSWORD_MAX_LENGTH)
    new_password = serializers.CharField(max_length=BASE_PASSWORD_MAX_LENGTH)

class GetUsersListSerializer(serializers.Serializer):
    session_user_id = serializers.IntegerField()
    user_keyword = serializers.CharField(required=False, max_length=BASE_USERNAME_MAX_LENGTH)

class GenerateSendSecurityCodeSerializer(serializers.Serializer):
    user_email = serializers.EmailField(max_length=BASE_EMAIL_MAX_LENGTH)
    message = serializers.CharField()

class CheckSecurityCodeSerializer(serializers.Serializer):
    user_email = serializers.EmailField(max_length=BASE_EMAIL_MAX_LENGTH)
    code = serializers.CharField(max_length=BASE_SECURITY_CODE_MAX_LENGTH)




class EnterChatSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField()
    related_notification_id = serializers.IntegerField(required=False)


class RecoveryPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=BASE_EMAIL_MAX_LENGTH)
    new_password = serializers.CharField(max_length=BASE_PASSWORD_MAX_LENGTH)
    security_code = serializers.CharField(max_length=BASE_SECURITY_CODE_MAX_LENGTH)


