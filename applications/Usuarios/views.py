from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
)
from rest_framework.views import APIView

from .serializers import (
    CreateUsuariosSerializer,
    CheckExistingUserSerializer
)
from rest_framework.response import Response
from .models import Usuarios
from .api_exceptions import ExistingUserException

class CreateUsuariosAPI(APIView):
    queryset = Usuarios.objects.all()
    serializer_class = CreateUsuariosSerializer
    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                new_user = Usuarios.objects.create_user(**request.data)
                return Response('User created!', status=status.HTTP_201_CREATED)
            except:
                return Response({'Bad Request': "Error creating user..."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'Bad Request': f"{serializer.error_messages}"}, status=status.HTTP_400_BAD_REQUEST)


class CheckExistingUser(APIView):
    serializer_class = CheckExistingUserSerializer
    def get(self, request, *args, **kwargs):
        if Usuarios.objects.userExists(kwargs['username'], kwargs['email']):
            return Response({'existing' : 'true'}, status.HTTP_202_ACCEPTED)
        else:
            return Response({'existing' : 'false'}, status.HTTP_202_ACCEPTED)
