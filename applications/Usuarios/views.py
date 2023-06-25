from rest_framework import status
from rest_framework.views import APIView

from .serializers import (
    CreateUsuariosSerializer,
    CheckExistingUserSerializer,
    ActivateUserSerializer
)
from rest_framework.response import Response
from .models import Usuarios

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
                return Response({'new_user_id' : new_user.id}, status=status.HTTP_201_CREATED)
            except:
                return Response({'Bad Request': "Error creating user..."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'Bad Request': f"{serializer.error_messages}"}, status=status.HTTP_400_BAD_REQUEST)


class CheckExistingUserAPI(APIView):
    serializer_class = CheckExistingUserSerializer
    def get(self, request, *args, **kwargs):
        if Usuarios.objects.userExists(kwargs['username'], kwargs['email']):
            return Response({'existing' : 'true'}, status.HTTP_202_ACCEPTED)
        else:
            return Response({'existing' : 'false'}, status.HTTP_202_ACCEPTED)

class ActivateUserAPI(APIView):
    serializer_class = ActivateUserSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if (serialized_data.is_valid()):
            try:
                user = Usuarios.objects.get(id=request.data['user_id'])
                user.is_active = True
                user.save()
                return Response({'Success' : 'User activated !'}, status.HTTP_200_OK)
            except:
                return Response({'Error' : 'Error while activating user'}, status.HTTP_500_INTERNAL_SERVER_ERROR) 
        else:
            return Response({'Bad request' : f'{serialized_data.error_messages}'}, status.HTTP_400_BAD_REQUEST)


