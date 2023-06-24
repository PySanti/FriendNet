from rest_framework.views import exception_handler
from datetime import datetime


def custom_exception_handler(exc, context):
    """
        Esta función se encargara de manejar los errores que puedan
        surgir en ejecución
    """
    response = exception_handler(exc, context)
    if response is not None:
        response.data['message'] = response.data['detail']
        response.data['time'] = datetime.now()
        del response.data['detail']
    return response