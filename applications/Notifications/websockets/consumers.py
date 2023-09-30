from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from applications.Chats.websockets.ws_utils.print_pretty_groups import print_pretty_groups
import json
from applications.Chats.websockets.ws_utils.discard_channel_if_found import discard_channel_if_found
from .ws_utils.get_opened_groups_with_id import get_opened_groups_with_id
from .ws_utils.connection_inform_dict import connection_inform_dict 
from .ws_utils.broadcast_connection_inform import broadcast_connection_inform

class NotificationsWSConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'-> Estableciendo conexion con websocket de notificaciones')

    def disconnect(self, close_code):
        print('-> Desconectando websocket de notificacion')
        group_name = discard_channel_if_found(self.channel_layer, self.channel_name)
        broadcast_connection_inform(user_id=group_name, connected=False)

    def receive(self, text_data):
        data = json.loads(text_data)
        if (data["type"] == "group_creation"):
            async_to_sync(self.channel_layer.group_add)(str(data['name']),self.channel_name)
            broadcast_connection_inform(user_id=data["name"], connected=True)
        print_pretty_groups(self.channel_layer.groups)

    def broadcast_notification_handler(self, event):
        self.send(text_data=json.dumps(event['value']))
