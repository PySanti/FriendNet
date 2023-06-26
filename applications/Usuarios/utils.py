from rest_framework.views import exception_handler
from datetime import datetime

USER_SHOWABLE_FIELDS = [
    "username",
    "email",
    "age",
    "first_names",
    "last_names",
    "photo_link",
    "is_active",
]

def custom_exception_handler(exc, context):
    """
        Esta función se encargara de manejar los errores que puedan
        surgir en ejecución
    """
    response = exception_handler(exc, context)
    if response is not None:
        response.data['time'] = datetime.now()
    return response