from rest_framework.views import exception_handler
from datetime import datetime

USER_SHOWABLE_FIELDS = [
    "username",
    "email",
    "age",
    "first_names",
    "last_names",
    "photo_link",
    # los siguientes campos no son realmente showable, simplemente son requeridos para escalabilidad
    "is_active",
    "id"
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