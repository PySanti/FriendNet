USERS_LIST_ATTRS = ["id", "username", "is_online", "photo_link"]

USER_SHOWABLE_FIELDS = [
    "username",
    "email",
    "photo_link",
    # los siguientes campos no son realmente showable, simplemente son requeridos para escalabilidad
    "is_active",
    "id",
]

BASE_SERIALIZER_ERROR_RESPONSE = {'error' : "serializer_error"}
BASE_IMAGES_WIDTH = 400
