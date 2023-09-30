from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .ws_utils.discard_channel_if_found import discard_channel_if_found
from .ws_utils.print_pretty_groups import print_pretty_groups
import json
from .ws_utils import broadcast_message

class ChatWSConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'Generando conexion a channel -> {self.channel_name}')

    def disconnect(self, close_code):
        print('-> Desconectando websocket de mensajes')
        discard_channel_if_found(self.channel_layer, self.channel_name)
        print_pretty_groups(self.channel_layer.groups)

    def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == "group_creation":
            discard_channel_if_found(self.channel_layer, self.channel_name)
            async_to_sync(self.channel_layer.group_add)(data['name'],self.channel_name)
        print_pretty_groups(self.channel_layer.groups)


    def broadcast_message_handler(self, event):
        value = event['value']
        value["type"] = "message_broadcast"
        self.send(text_data=json.dumps(value))

    def broadcast_connection_inform(self, event):
        self.send(text_data=json.dumps(event['value']))
