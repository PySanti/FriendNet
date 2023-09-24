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
                messages_hist = Chats.objects.getMessagesHistorialReady(request, request.data['receiver_id'], self)
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
            else:
                if (messages_hist == "no_more_pages"):
                    return BASE_NO_MORE_PAGES_RESPONSE
                elif (messages_hist == "no_messages_between"):
                    return Response('no_messages_between', status.HTTP_200_OK)
                else:
                    return JsonResponse(messages_hist, status=status.HTTP_200_OK)
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
                new_notification_id = None
                if (not Notifications.objects.hasNotification(receiver_user, sender_user)) and (request.data["create_notification"]):
                    print("Creando notificacion")
                    new_notification_id = Notifications.objects.addNotification(f"Tienes mensajes nuevos de {sender_user.username}", receiver_user, sender_user)
                else:
                    print('No se creara la notificacion por que el grupo esta lleno o por que ya existe')
                new_message = Messages.objects.createMessage(parent=sender_user, content=request.data['msg'])
                Chats.objects.sendMessage(sender_user, receiver_user,new_message)
                new_message_values = new_message.__dict__.copy()
                del new_message_values['_state']
                return JsonResponse({'sended_msg' : new_message_values, 'sended_notification_id' : new_notification_id }, status=status.HTTP_200_OK)
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            print(serialized_data._errors)
            return BASE_SERIALIZER_ERROR_RESPONSE
