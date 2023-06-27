from rest_framework import status
from rest_framework.views import APIView
from .utils import USER_SHOWABLE_FIELDS

from .serializers import (
    CreateUsuariosSerializer,
    CheckExistingUserSerializer,
    ActivateUserSerializer,
    GetUserDetailSerializer,
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
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            if Usuarios.objects.userExists(request.data['username'], request.data['email']):
                return Response({'existing' : 'true'}, status.HTTP_200_OK)
            else:
                return Response({'existing' : 'false'}, status.HTTP_200_OK)
        else:

            return Response({'error' : f"{serialized_data.error_messages}"}, status.HTTP_400_BAD_REQUEST)

class GetUserDetailAPI(APIView):
    serializer_class = GetUserDetailSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            user = Usuarios.objects.userExists(request.data['username'])
            if user:
                user=user[0]
                user = {i[0]:i[1] for i in user.__dict__.items() if i[0] in USER_SHOWABLE_FIELDS}
                print(user)
                return Response(user, status.HTTP_200_OK)
            else:
                return Response({'error' : 'user_not_exists'}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error' : 'seralizer failed'}, status=status.HTTP_400_BAD_REQUEST)


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


