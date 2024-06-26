from rest_framework.response import Response
from rest_framework import status

import os


os.environ.setdefault("DJANGO_SETTINGS_MODULE", f'FriendNet.settings')

USERS_LIST_ATTRS = ["id", "username", "photo_link"]
BASE_USERNAME_MAX_LENGTH = 15
BASE_EMAIL_MAX_LENGTH = 60
BASE_PASSWORD_MAX_LENGTH = 30
BASE_SECURITY_CODE_MAX_LENGTH = 10
USER_SHOWABLE_FIELDS = [
    "username",
    "email",
    "photo_link",
    # los siguientes campos no son realmente showable, simplemente son requeridos para escalabilidad
    "is_active",
    "id",
]
BASE_SERIALIZER_ERROR_RESPONSE = Response({'error' : "serializer_error"}, status.HTTP_400_BAD_REQUEST)
BASE_UNEXPECTED_ERROR_RESPONSE = Response({'error' : "unexpected_error"}, status.HTTP_400_BAD_REQUEST)
BASE_NO_MORE_PAGES_RESPONSE = Response({'error' : "no_more_pages"}, status.HTTP_400_BAD_REQUEST)
BASE_IMAGES_WIDTH = 400
BASE_ERROR_WHILE_DELETING_NOTIFICATION_RESPONSE = Response({'error' : 'error_while_deleting_notification'}, status=status.HTTP_400_BAD_REQUEST)
BASE_ERROR_WHILE_GETTING_MESSAGES_RESPONSE = Response({'error' : 'error_while_getting_messages'}, status=status.HTTP_400_BAD_REQUEST)
BASE_USER_NOT_EXISTS_RESPONSE = Response({'error' : 'user_not_exists'}, status.HTTP_400_BAD_REQUEST) 