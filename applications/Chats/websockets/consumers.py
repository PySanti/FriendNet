from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .ws_utils.discard_channel_if_found import discard_channel_if_found
from .ws_utils.print_pretty_groups import print_pretty_groups
import json
from .ws_utils.group_info_dict import group_info_dict
from .ws_utils.bye_to_last_group import bye_to_last_group

class ChatWSConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'Generando conexion a channel -> {self.channel_name}')

    def disconnect(self, close_code):
        print('-> Desconectando websocket de mensajes')
        bye_to_last_group(self)
        print_pretty_groups(self.channel_layer.groups)

    def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == "group_creation":
            bye_to_last_group(self)
            async_to_sync(self.channel_layer.group_add)(data['name'],self.channel_name)
            async_to_sync(self.channel_layer.group_send)(data['name'],group_info_dict(len(self.channel_layer.groups[data['name']]) == 2))
        if data['type'] == "message_broadcasting":
            if (len(self.channel_layer.groups[data['name']]) == 2):
                async_to_sync(self.channel_layer.group_send)(
                    data['name'],
                    {
                        'type' : 'chat_message',
                        'value' : data['value']
                    }
                )
        print_pretty_groups(self.channel_layer.groups)


    def chat_message(self, event):
        value = event['value']
        value["type"] = "message_broadcast"
        self.send(text_data=json.dumps(value))

    def group_info(self, event):
        value = event['value']
        value["type"] = "group_info"
        self.send(text_data=json.dumps(value))

    def broadcast_connection_inform(self, event):
        self.send(text_data=json.dumps(event['value']))
