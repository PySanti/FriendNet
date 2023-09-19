from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from applications.Chats.websockets.ws_utils.print_pretty_groups import print_pretty_groups
import json
class NotificationsConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        
        print(f'-> Estableciendo conexion con websocket de notificaciones')

    def disconnect(self, close_code):
        print('-> Desconectando websocket de notificacion')

    def receive(self, text_data):
        print('Recibiendo info del front-end')
        data = json.loads(text_data)
        print(data)
        if (data["type"] == "group_creation"):
            async_to_sync(self.channel_layer.group_add)(
                str(data['name']),
                self.channel_name
            )
        print_pretty_groups(self.channel_layer.groups)



