from django.shortcuts import render
from applications.Usuarios.utils.constants import BASE_NO_MORE_PAGES_RESPONSE, USERS_LIST_ATTRS
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
    BASE_UNEXPECTED_ERROR_RESPONSE,
    BASE_ERROR_WHILE_GETTING_MESSAGES_RESPONSE,
    BASE_RATE_LIMIT_TIMER,
    BASE_RATE_LIMIT_KEY
)
from applications.Usuarios.models import Usuarios
from applications.Notifications.models import Notifications
# Create your views here.
from applications.Notifications.websockets.ws_utils.notification_wesocket_is_opened import notification_wesocket_is_opened
from .websockets.ws_utils.messages_group_is_full import messages_group_is_full
from applications.Notifications.websockets.ws_utils.broadcast_notification import broadcast_notification
from applications.Chats.websockets.ws_utils.broadcast_message import broadcast_message
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit

class GetMessagesHistorialAPI(APIView):
    serializer_class        =  GetMessagesHistorialSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    pagination_class        = MessagesPaginationClass

    @method_decorator(ratelimit(key=BASE_RATE_LIMIT_KEY, rate=BASE_RATE_LIMIT_TIMER, method="POST"))
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            # request.user = sender_user
            try:
                messages_hist = Chats.objects.getMessagesHistorialReady(request, request.data['receiver_id'], self)
            except Exception:
                return BASE_ERROR_WHILE_GETTING_MESSAGES_RESPONSE
            else:
                if (messages_hist == "no_more_pages"):
                    return BASE_NO_MORE_PAGES_RESPONSE
                elif (messages_hist == "no_messages_between"):
                    return Response('no_messages_between', status.HTTP_200_OK)
                else:
                    return JsonResponse(messages_hist, status=status.HTTP_200_OK)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE

class SendMsgAPI(APIView):
    serializer_class        = SendMsgSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    @method_decorator(ratelimit(key=BASE_RATE_LIMIT_KEY, rate=BASE_RATE_LIMIT_TIMER, method="POST"))
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                sender_user = request.user
                receiver_user = Usuarios.objects.get(id=request.data['receiver_id'])
                if (not Notifications.objects.hasNotification(receiver_user, sender_user) and (not messages_group_is_full(receiver_user.id, sender_user.id))):
                    new_notification = Notifications.objects.addNotification(f"Tienes mensajes nuevos de {sender_user.username}", receiver_user, sender_user)
                    if (notification_wesocket_is_opened(receiver_user.id)):
                        new_notification = Notifications.objects.filter(id=new_notification.id).values("msg", "id")[0]
                        new_notification["sender_user"] = Usuarios.objects.filter(id=sender_user.id).values(*USERS_LIST_ATTRS)[0]
                        broadcast_notification(receiver_user.id, new_notification)
                new_message = Messages.objects.createMessage(parent=sender_user, content=request.data['msg'])
                Chats.objects.sendMessage(sender_user, receiver_user,new_message)
                new_message_values = new_message.__dict__.copy()
                del new_message_values['_state']
                if (messages_group_is_full(receiver_user.id, sender_user.id)):
                    broadcast_message(sender_user.id, receiver_user.id, new_message_values)
                return JsonResponse({'sended_msg' : new_message_values}, status=status.HTTP_200_OK)
            except:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE
