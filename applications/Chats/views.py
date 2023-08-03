from django.shortcuts import render
from rest_framework.views import (
    APIView,
)
from rest_framework_simplejwt.authentication import (
    JWTAuthentication
)
from rest_framework.permissions import (
    IsAuthenticated
)
from .serializers import (
    GetMessagesHistorialSerializer,
    SendMsgSerializer
)
from .models import (
    Chats,
    Messages
)
from rest_framework.response import Response 
from django.http import JsonResponse
from rest_framework import status
from applications.Usuarios.utils.constants import (
    BASE_SERIALIZER_ERROR_RESPONSE
)
from applications.Usuarios.models import Usuarios
from applications.Notifications.models import Notifications
# Create your views here.

class GetMessagesHistorialAPI(APIView):
    serializer_class        =  GetMessagesHistorialSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            messages_hist = Chats.objects.getMessagesHistorial(request.user.id, request.data['receiver_id'])
            if (messages_hist):
                return JsonResponse({"messages_hist" : list(messages_hist.values())})
            else:
                return Response('no_messages_between', status.HTTP_200_OK)
        else:
            print(serialized_data._errors)
            return Response({'error' : BASE_SERIALIZER_ERROR_RESPONSE}, status.HTTP_400_BAD_REQUEST)

class SendMsgAPI(APIView):
    serializer_class        = SendMsgSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            sender_user = request.user
            receiver_user = Usuarios.objects.get(id=request.data['receiver_id'])
            if (not Notifications.objects.hasNotification(receiver_user, sender_user)):
                Notifications.objects.addNotification(f"Tienes mensajes nuevos de {sender_user.username}", receiver_user, sender_user)
            new_message = Messages.objects.createMessage(parent=sender_user, content=request.data['msg'])
            Chats.objects.sendMessage(sender_user, receiver_user,new_message)
            return Response({'success' : "msg_sended"}, status.HTTP_200_OK)
        else:
            print(serialized_data._errors)
            return Response({'error' : BASE_SERIALIZER_ERROR_RESPONSE}, status.HTTP_400_BAD_REQUEST)
