from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .ws_utils.discard_channel_if_found import discard_channel_if_found
from .ws_utils.print_pretty_groups import print_pretty_groups
import json
from .ws_utils.group_info_dict import group_info_dict

class MessagesConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'Generando conexion a channel -> {self.channel_name}')

    def disconnect(self, close_code):
        print('Desconectando websocket')
        print(f'Eliminando channel : {self.channel_name}')
        last_group_name = discard_channel_if_found(self.channel_layer, self.channel_name)
        if last_group_name and (last_group_name in self.channel_layer.groups):
            async_to_sync(self.channel_layer.group_send)(last_group_name,group_info_dict(is_group_full=False))
        print_pretty_groups(self.channel_layer.groups)

    def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == "group_creation":
            last_group_name = discard_channel_if_found(self.channel_layer, self.channel_name)
            if last_group_name and (last_group_name in self.channel_layer.groups):
                async_to_sync(self.channel_layer.group_send)(last_group_name,group_info_dict(is_group_full=False))
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


