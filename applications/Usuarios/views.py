from rest_framework import status
from rest_framework.views import (
    APIView,
)
from rest_framework.generics import (
    UpdateAPIView
)
from .utils import (
    USER_SHOWABLE_FIELDS,
    BASE_SERIALIZER_ERROR_RESPONSE
)

from .serializers import (
    CreateUsuariosSerializer,
    CheckExistingUserSerializer,
    ActivateUserSerializer,
    GetUserDetailSerializer,
    UpdateUsuariosSerializer
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
                return Response({'error': "error_creating"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': BASE_SERIALIZER_ERROR_RESPONSE}, status=status.HTTP_400_BAD_REQUEST)


class CheckExistingUserAPI(APIView):
    serializer_class = CheckExistingUserSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            if Usuarios.objects.userExists(request.data['username'], request.data['email']):
                return Response({'existing' : 'true'}, status.HTTP_200_OK)
            else:
                return Response({'existing' : 'false'}, status.HTTP_200_OK)
        else:
            return Response({'error' : BASE_SERIALIZER_ERROR_RESPONSE}, status.HTTP_400_BAD_REQUEST)

class GetUserDetailAPI(APIView):
    serializer_class = GetUserDetailSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            user = Usuarios.objects.userExists(request.data['username'])
            if user:
                user=user[0]
                user = {i[0]:i[1] for i in user.__dict__.items() if i[0] in USER_SHOWABLE_FIELDS}
                return Response(user, status.HTTP_200_OK)
            else:
                return Response({'error' : 'user_not_exists'}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error' : BASE_SERIALIZER_ERROR_RESPONSE}, status=status.HTTP_400_BAD_REQUEST)


class ActivateUserAPI(APIView):
    serializer_class = ActivateUserSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if (serialized_data.is_valid()):
            try:
                user = Usuarios.objects.get(id=request.data['user_id'])
                user.is_active = True
                user.save()
                return Response({'success' : 'user_activated'}, status.HTTP_200_OK)
            except:
                return Response({'error' : 'error_activating_user'}, status.HTTP_500_INTERNAL_SERVER_ERROR) 
        else:
            print(serialized_data.errors)
            return Response({'error' : BASE_SERIALIZER_ERROR_RESPONSE}, status.HTTP_400_BAD_REQUEST)


class UpdateUserData(UpdateAPIView):
    serializer_class = UpdateUsuariosSerializer
    queryset = Usuarios.objects.all()