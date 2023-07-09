from rest_framework import status
from rest_framework.views import (
    APIView,
)
from rest_framework.generics import (
    UpdateAPIView,
    DestroyAPIView
)
from .utils import (
    USER_SHOWABLE_FIELDS,
    BASE_SERIALIZER_ERROR_RESPONSE
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
    GetChatBetweenSerializer,
    SendMsgSerializer,
    RemoveNotificationSerializer
)
from rest_framework.response import Response
from .models import Usuarios
from applications.Chats.models import (
    Chat,
    Messages,
)
from applications.Notifications.models import (
    Notifications
)

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


class UpdateUserDataAPI(UpdateAPIView):
    serializer_class = UpdateUsuariosSerializer
    queryset = Usuarios.objects.all()
    def put(self, *args, **kwargs):
        user = Usuarios.objects.get(id=kwargs['pk'])
        Notifications.objects.addNotification("Has actualizado tu perfil",user, "u")
        return super().put(*args, **kwargs)

class ChangeUserPwdAPI(APIView):
    serializer_class = ChangeUserPwdSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            user = Usuarios.objects.get(username=request.data['username'])
            if check_password(request.data['old_password'], user.password):
                user.set_password(request.data['new_password'])
                user.save()
                return Response({'success' : 'pwd_setted'}, status.HTTP_200_OK)
            else:
                return Response({'error' : 'invalid_pwd'}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error' : BASE_SERIALIZER_ERROR_RESPONSE}, status.HTTP_400_BAD_REQUEST)

class GetUsersListAPI(APIView):
    serializer_class = GetUsersListSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            users_list = Usuarios.objects.all().exclude(id=request.data['session_user_id']).values("id", "username", "is_online", "photo_link")
            return JsonResponse({"users_list": list(users_list)})
        else:
            print(serialized_data.errors)
            return Response({'error' : BASE_SERIALIZER_ERROR_RESPONSE}, status.HTTP_400_BAD_REQUEST)


class SendMsgAPI(APIView):
    serializer_class = SendMsgSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            sender_user = Usuarios.objects.get(id=request.data['sender_id'])
            receiver_user = Usuarios.objects.get(id=request.data['receiver_id'])
            Notifications.objects.addNotification(f"{sender_user.username} te ha enviado un mensaje", receiver_user, f"{sender_user.id}")
            new_message = Messages(parent_id=request.data['sender_id'], content=request.data['msg'])
            new_message.save()
            Chat.objects.sendMessage(sender_user, receiver_user,new_message)
            return Response({'success' : "msg_sended"}, status.HTTP_200_OK)
        else:
            print(serialized_data.errors)
            return Response({'error' : BASE_SERIALIZER_ERROR_RESPONSE}, status.HTTP_400_BAD_REQUEST)


class GetChatBetweenAPI(APIView):
    serializer_class =  GetChatBetweenSerializer
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            messages_hist = Chat.objects.getMessagesHistorial(request.data['id_1'], request.data['id_2'])
            if (messages_hist):
                return JsonResponse({"messages_hist" : list(messages_hist.values())})
            else:
                return Response('no_chats_between', status.HTTP_200_OK)
        else:
            print(serialized_data.errors)
            return Response({'error' : BASE_SERIALIZER_ERROR_RESPONSE}, status.HTTP_400_BAD_REQUEST)


class GetUserNotificationsAPI(APIView):
    def get(self, request, *args, **kwargs):
        try:
            user_notifications = Usuarios.objects.get(id=kwargs['pk']).notifications
            return JsonResponse({"notifications" : list(user_notifications.values())})
        except:
            return Response({"error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RemoveNotificationAPI(DestroyAPIView):
    serializer_class = RemoveNotificationSerializer
    queryset = Notifications.objects.all()