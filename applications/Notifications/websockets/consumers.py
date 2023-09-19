from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from applications.Chats.websockets.ws_utils.print_pretty_groups import print_pretty_groups
import json
from applications.Chats.websockets.ws_utils.discard_channel_if_found import discard_channel_if_found
from .ws_utils.notifications_group_name import notifications_group_name
class NotificationsConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'-> Estableciendo conexion con websocket de notificaciones')

    def disconnect(self, close_code):
        print('-> Desconectando websocket de notificacion')
        discard_channel_if_found(self.channel_layer, self.channel_name)

    def receive(self, text_data):
        print('Recibiendo info del front-end')
        data = json.loads(text_data)
        print(data)
        if (data["type"] == "group_creation"):
            async_to_sync(self.channel_layer.group_add)(
                str(data['name']),
                self.channel_name
            )
        if (data["type"] == "notification_broadcasting"):
            try:
                receiver_channel = self.channel_layer.groups[str(data["receiver_user_id"])]
                session_channel = self.channel_layer.groups[str(data["session_user_id"])]
                group_name = notifications_group_name(data["session_user_id"], data["receiver_user_id"])
                print(f'Session channel {session_channel}')
                print(f'Receiver channel {receiver_channel}')
                async_to_sync(self.channel_layer.group_add)(group_name, session_channel)
                async_to_sync(self.channel_layer.group_add)(group_name,receiver_channel)
            except KeyError:
                print('El receiver user no tiene un channel abierto')
            else:
                print(f"Channel de receiver user {receiver_channel}")
        print_pretty_groups(self.channel_layer.groups)



