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
from .ws_utils.connection_inform_dict import connection_inform_dict 
from .ws_utils.broadcast_notification import broadcast_notification

class NotificationsWSConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'-> Estableciendo conexion con websocket de notificaciones')

    def disconnect(self, close_code):
        print('-> Desconectando websocket de notificacion')
        group_name = discard_channel_if_found(self.channel_layer, self.channel_name)
        for group in get_opened_groups_with_id(group_name, self.channel_layer.groups):
            async_to_sync(self.channel_layer.group_send)(group,connection_inform_dict(group_name, False))

    def receive(self, text_data):
        data = json.loads(text_data)
        if (data["type"] == "group_creation"):
            async_to_sync(self.channel_layer.group_add)(str(data['name']),self.channel_name)

        if (data['type'] == "connection_inform"):
            for group in get_opened_groups_with_id(data["user_id"], self.channel_layer.groups):
                async_to_sync(self.channel_layer.group_send)(group,connection_inform_dict(data['user_id'], data['connected']))

        print_pretty_groups(self.channel_layer.groups)

    def broadcast_notification_handler(self, event):
        self.send(text_data=json.dumps(event['value']))
