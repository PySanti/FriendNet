from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .ws_utils.discard_channel_if_found import discard_channel_if_found
from .ws_utils.print_pretty_groups import print_pretty_groups
import json
from .ws_utils.broadcast_dict import broadcast_dict

class ChatWSConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'Generando conexion a channel -> {self.channel_name}')

    def disconnect(self, close_code):
        discard_channel_if_found(self.channel_name)

    def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == "group_creation":
            discard_channel_if_found(self.channel_name)
            async_to_sync(self.channel_layer.group_add)(data['name'],self.channel_name)
        print_pretty_groups()


    def broadcast_message(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="message_broadcast", broadcast_value=event["value"])))

    def broadcast_connection_inform(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="connection_inform", broadcast_value=event["value"])))

