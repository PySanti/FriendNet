from typing import Any
from rest_framework.generics import (
    CreateAPIView
)

from .serializers import CreateUsuariosSerializer
from .models import Usuarios
from .api_exceptions import ExistingUserException

class CreateUsuariosAPI(CreateAPIView):
    queryset = Usuarios.objects.all()
    serializer_class = CreateUsuariosSerializer
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
    def post(self, request, *args, **kwargs):
        if Usuarios.objects.filter(username=request.data['username']):
            raise ExistingUserException('existing username')
        elif Usuarios.objects.filter(email=request.data['email']):
            raise ExistingUserException('existing email')
        else:
            new_user = Usuarios.objects.create_user(**request.data)
            return super().post(request, *args, **kwargs)