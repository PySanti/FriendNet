from django.conf import settings
from .utils.create_message_prev import create_message_prev
from asgiref.sync import async_to_sync
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
)
from applications.Usuarios.models import Usuarios
from applications.Notifications.models import Notifications
# Create your views here.
from applications.Notifications.websockets.ws_utils.notification_websocket_is_opened import notification_websocket_is_opened
from applications.Notifications.websockets.ws_utils.broadcast_notification import broadcast_notification
from applications.Notifications.websockets.ws_utils.messages_group_is_full import messages_group_is_full
from applications.Notifications.websockets.ws_utils.broadcast_message import broadcast_message
from applications.Usuarios.utils.add_istyping_field import add_istyping_field
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
                messages_hist = Chats.objects.get_messages_historial_page(request, request.data['receiver_id'], self)
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
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                if (request.user.id == request.data["receiver_id"]):
                    return Response({"error" : "same_user"}, status=status.HTTP_400_BAD_REQUEST)
                sender_user = request.user
                receiver_user = Usuarios.objects.get(id=request.data['receiver_id'])
                if (not Notifications.objects.has_notification(receiver_user, sender_user) and (not messages_group_is_full(receiver_user.id, sender_user.id))):

                    new_notification = Notifications.objects.add_notification(
                            notification_msg= request.data["msg"], 
                            receiver_user=receiver_user, 
                            sender_user=sender_user)
                    
                    # en caso de que el usuario este activo
                    if (notification_websocket_is_opened(receiver_user.id)): 
                        new_notification = Notifications.objects.filter(id=new_notification.id).values("msg", "id")[0]
                        new_notification["sender_user"] = add_istyping_field(Usuarios.objects.filter(id=sender_user.id).values(*USERS_LIST_ATTRS))[0]
                        async_to_sync(broadcast_notification)(receiver_user.id, new_notification)
                    

                    # en caso de que el usuario no este activo
                    else:
                        if (not settings.DEBUG): # si estamos en produccion
                            Notifications.objects.send_notification_mail(receiver_user)
                new_message = Messages.objects.create_message(parent=sender_user, content=request.data['msg'])
                Chats.objects.send_message(sender_user, receiver_user,new_message)
                new_message_values = new_message.__dict__.copy()
                del new_message_values['_state']
                if (messages_group_is_full(receiver_user.id, sender_user.id)):
                    async_to_sync(broadcast_message)(sender_user.id, receiver_user.id, new_message_values)
                return JsonResponse({'sended_msg' : new_message_values}, status=status.HTTP_200_OK)
            except:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE
