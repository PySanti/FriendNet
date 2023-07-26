from rest_framework import status
from rest_framework.views import (
    APIView,
)
from .utils.set_photo_link import set_photo_link
from .utils.constants import (
    BASE_SERIALIZER_ERROR_RESPONSE,
    USERS_LIST_ATTRS,
    USER_SHOWABLE_FIELDS
)

from django.contrib.auth.hashers import (
    check_password
)
from django.http import JsonResponse
from .serializers import (
    CreateUsuariosSerializer,
    CheckExistingUserSerializer,
    ActivateUserSerializer,
    GetUserDetailSerializer,
    UpdateUsuariosSerializer,
    ChangeUserPwdSerializer,
    GetUsersListSerializer,
    DisconnectUserSerializer
)
from rest_framework.response import Response
from .models import Usuarios


class CreateUsuariosAPI(APIView):
    queryset = Usuarios.objects.all()
    serializer_class = CreateUsuariosSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serialized_data = serializer.data.copy()
            serialized_data = set_photo_link(serialized_data, "creating")
            try:
                new_user = Usuarios.objects.create_user(**serialized_data)
                return Response({'new_user_id' : new_user.id}, status=status.HTTP_201_CREATED)
            except:
                return Response({'error': "error_creating"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(serializer.error_messages)
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserDataAPI(APIView):
    serializer_class = UpdateUsuariosSerializer
    queryset = Usuarios.objects.all()
    def put(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serialized_data = serializer.data.copy()
            serialized_data = set_photo_link(serialized_data, "updating")
            required_attrs = USER_SHOWABLE_FIELDS.copy()
            required_attrs.remove("id")
            required_attrs.remove("is_active")
            try:
                updated_user = Usuarios.objects.updateUser(kwargs['pk'], serialized_data)
                return JsonResponse({'user_data_updated' : {i[0]:i[1] for i in updated_user.__dict__.items() if i[0] in required_attrs}}, status=status.HTTP_200_OK)
            except:
                return Response({'error': "error_updating"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status=status.HTTP_400_BAD_REQUEST)




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
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)
class GetUserDetailAPI(APIView):
    serializer_class = GetUserDetailSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            user = Usuarios.objects.userExists(request.data['username'])
            if user:
                user=user[0]
                if check_password(request.data['password'], user.password):
                    # Se enviaran las notificaciones al frontend al principio de la sesion
                    # para cachearlos en el Local Storage. De Este modo evitaremos
                    # llamadas al backend cada vez que queramos revisarlas
                    formated_user_data = Usuarios.objects.getFormatedUserData(user)
                    Usuarios.objects.deleteAllNotifications(user)
                    return JsonResponse({'user' : formated_user_data})
                else:
                    return Response({'error' : 'user_not_exists'}, status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error' : 'user_not_exists'}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status=status.HTTP_400_BAD_REQUEST)
class ActivateUserAPI(APIView):
    serializer_class = ActivateUserSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if (serialized_data.is_valid()):
            try:
                Usuarios.objects.activateUser(Usuarios.objects.get(id=request.data['user_id']))
                return Response({'success' : 'user_activated'}, status.HTTP_200_OK)
            except:
                return Response({'error' : 'error_activating_user'}, status.HTTP_500_INTERNAL_SERVER_ERROR) 
        else:
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)
class ChangeUserPwdAPI(APIView):
    serializer_class = ChangeUserPwdSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            user = Usuarios.objects.get(id=request.data['user_id'])
            if check_password(request.data['old_password'], user.password):
                Usuarios.objects.changePassword(user, request.data['new_password'])
                return Response({'success' : 'pwd_setted'}, status.HTTP_200_OK)
            else:
                return Response({'error' : 'invalid_pwd'}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)
class GetUsersListAPI(APIView):
    serializer_class = GetUsersListSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            users_list = Usuarios.objects.filter(is_active=True).exclude(id=request.data['session_user_id']).values(*USERS_LIST_ATTRS)
            return JsonResponse({"users_list": list(users_list)})
        else:
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)


class DisconnectUserAPI(APIView):
    serializer_class = DisconnectUserSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            user = Usuarios.objects.get(id=request.data['session_user_id'])
            Usuarios.objects.setUserConection(user, False)
            return Response({'success' : 'user_disconected'}, status.HTTP_200_OK)
        else:
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)