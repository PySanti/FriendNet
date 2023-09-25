from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from applications.Chats.websockets.ws_utils.print_pretty_groups import print_pretty_groups
import json
from applications.Chats.websockets.ws_utils.discard_channel_if_found import discard_channel_if_found
from .ws_utils.notifications_group_name import notifications_group_name
from applications.Notifications.models import Notifications
from applications.Usuarios.utils.constants import USERS_LIST_ATTRS
from applications.Usuarios.models import Usuarios
from applications.Chats.websockets.ws_utils.messages_group_name import messages_group_name
from .ws_utils.get_opened_groups_with_id import get_opened_groups_with_id

class NotificationsConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'-> Estableciendo conexion con websocket de notificaciones')

    def disconnect(self, close_code):
        print('-> Desconectando websocket de notificacion')
        discard_channel_if_found(self.channel_layer, self.channel_name)

    def receive(self, text_data):
        data = json.loads(text_data)
        if (data["type"] == "group_creation"):
            async_to_sync(self.channel_layer.group_add)(str(data['name']),self.channel_name)
        if (data["type"] == "notification_broadcasting"):
            try:
                receiver_channel = self.channel_layer.groups[str(data["receiver_user_id"])]
            except KeyError:
                print('El receiver user no tiene un channel abierto')
            else:
                target_notification = Notifications.objects.filter(id=data["notification_id"]).values("msg", "id")[0]
                target_notification["sender_user"] = Usuarios.objects.filter(id=data["session_user_id"]).values(*USERS_LIST_ATTRS)[0]
                receiver_channel = list(receiver_channel.keys())[0]
                group_name = notifications_group_name(data["session_user_id"], data["receiver_user_id"])
                async_to_sync(self.channel_layer.group_add)(group_name, self.channel_name)
                async_to_sync(self.channel_layer.group_add)(group_name,receiver_channel)

                async_to_sync(self.channel_layer.group_send)(group_name,{    'type' : 'broadcast_notification',    'value' : target_notification})

                async_to_sync(self.channel_layer.group_discard)(group_name, self.channel_name)
                async_to_sync(self.channel_layer.group_discard)(group_name, receiver_channel)


        if (data['type'] == "connection_inform"):
            print(get_opened_groups_with_id(data["session_user_id"], self.channel_layer.groups))

        print_pretty_groups(self.channel_layer.groups)

    def broadcast_notification(self, event):
        self.send(text_data=json.dumps(event['value']))



