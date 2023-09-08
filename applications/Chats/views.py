from django.shortcuts import render
from applications.Usuarios.utils.constants import BASE_NO_MORE_PAGES_RESPONSE
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
from .paginators import (
    MessagesPaginationClass
)
from applications.Usuarios.utils.constants import (
    BASE_SERIALIZER_ERROR_RESPONSE,
    BASE_UNEXPECTED_ERROR_RESPONSE
)
from applications.Usuarios.models import Usuarios
from applications.Notifications.models import Notifications
# Create your views here.

class GetMessagesHistorialAPI(APIView):
    serializer_class        =  GetMessagesHistorialSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    pagination_class        = MessagesPaginationClass

    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            # request.user = sender_user
            try:
                messages_hist = Chats.objects.getMessagesHistorial(request.user.id, request.data['receiver_id'])
                if (messages_hist):
                    try:
                        messages_hist = self.pagination_class().paginate_queryset(messages_hist.values(), request)
                        return JsonResponse({"messages_hist" : messages_hist}, status=status.HTTP_200_OK)
                    except Exception:
                        return BASE_NO_MORE_PAGES_RESPONSE
                else:
                    return Response('no_messages_between', status.HTTP_200_OK)
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            print(serialized_data._errors)
            return BASE_SERIALIZER_ERROR_RESPONSE

class SendMsgAPI(APIView):
    serializer_class        = SendMsgSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                sender_user = request.user
                receiver_user = Usuarios.objects.get(id=request.data['receiver_id'])
                if (not Notifications.objects.hasNotification(receiver_user, sender_user)):
                    Notifications.objects.addNotification(f"Tienes mensajes nuevos de {sender_user.username}", receiver_user, sender_user)
                new_message = Messages.objects.createMessage(parent=sender_user, content=request.data['msg'])
                Chats.objects.sendMessage(sender_user, receiver_user,new_message)
                return JsonResponse({'sended_msg' : Messages.objects.filter(id=new_message.id).values()[0]}, status=status.HTTP_200_OK)
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            print(serialized_data._errors)
            return BASE_SERIALIZER_ERROR_RESPONSE
