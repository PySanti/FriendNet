from rest_framework.views import exception_handler
from datetime import datetime

# atributos que tendran los usuarios del users_list
USERS_LIST_ATTRS = ["id", "username", "is_online", "photo_link"]

USER_SHOWABLE_FIELDS = [
    "username",
    "email",
    "age",
    "first_names",
    "last_names",
    "photo_link",
    # los siguientes campos no son realmente showable, simplemente son requeridos para escalabilidad
    "is_active",
    "id",
]

BASE_SERIALIZER_ERROR_RESPONSE = {'error' : "serializer_error"}

def custom_exception_handler(exc, context):
    """
        Esta función se encargara de manejar los errores que puedan
        surgir en ejecución
    """
    response = exception_handler(exc, context)
    if response is not None:
        response.data['time'] = datetime.now()
    return response