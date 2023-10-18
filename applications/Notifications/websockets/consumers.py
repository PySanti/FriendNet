from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from applications.Chats.websockets.ws_utils.print_pretty_groups import print_pretty_groups
import json
from applications.Chats.websockets.ws_utils.discard_channel_if_found import discard_channel_if_found
from .ws_utils.broadcast_connection_inform import broadcast_connection_inform
from applications.Chats.websockets.ws_utils.broadcast_dict import broadcast_dict

class NotificationsWSConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'-> Estableciendo conexion con websocket de notificaciones')

    def disconnect(self, close_code):
        print('-> Desconectando websocket de notificacion')
        group_name = discard_channel_if_found(self.channel_name)
        broadcast_connection_inform(user_id=group_name, connected=False)

    def receive(self, text_data):
        data = json.loads(text_data)
        if (data["type"] == "group_creation"):
            async_to_sync(self.channel_layer.group_add)(str(data['name']),self.channel_name)
            if len(self.channel_layer.groups[str(data["name"])])>1:
                async_to_sync(self.channel_layer.group_send)(str(data["name"]),{"type" : "broadcast_connection_error_handler"})
            else:
                broadcast_connection_inform(user_id=data["name"], connected=True)
        if (data["type"] == "typing_inform"):
            pass
        print_pretty_groups()

    def broadcast_notification_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="new_notification", broadcast_value=event["value"])))
    def broadcast_connection_error_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="connection_error")))
    def broadcast_updated_user_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="updated_user", broadcast_value=event["value"])))

