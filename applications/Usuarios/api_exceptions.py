from rest_framework import status
from rest_framework.exceptions import APIException


class BaseUserExeption(APIException):
    detail = None
    status_code = None
    def __init__(self, detail, code):
        super().__init__(detail, code)
        self.detail = detail
        self.status_code = code


class ExistingUserException(BaseUserExeption):
    """
        Clase creada para representar errores de
        validacion por existencia en base
        de datos
    """
    def __init__(self, detail):
        super().__init__(detail, status.HTTP_400_BAD_REQUEST)