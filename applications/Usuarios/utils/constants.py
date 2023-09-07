from rest_framework.response import Response
from rest_framework import status

USERS_LIST_ATTRS = ["id", "username", "is_online", "photo_link"]
USER_SHOWABLE_FIELDS = [
    "username",
    "email",
    "photo_link",
    # los siguientes campos no son realmente showable, simplemente son requeridos para escalabilidad
    "is_active",
    "id",
]
BASE_SERIALIZER_ERROR_RESPONSE = Response({'error' : "serializer_error"}, status.HTTP_400_BAD_REQUEST)
BASE_UNEXPECTED_ERROR_RESPONSE = Response({'error' : "unexpected_error"}, status.HTTP_500_INTERNAL_SERVER_ERROR)
BASE_NO_MORE_PAGES_RESPONSE = Response({'error' : "no_more_pages"}, status.HTTP_400_BAD_REQUEST)
BASE_IMAGES_WIDTH = 400
