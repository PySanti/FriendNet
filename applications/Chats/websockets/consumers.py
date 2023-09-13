from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .ws_utils.discard_channel_if_found import discard_channel_if_found
from .ws_utils.print_pretty_groups import print_pretty_groups
import json


class MessagesConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'Generando conexion a channel -> {self.channel_name}')

    def disconnect(self, close_code):
        print('Desconectando websocket')
        print(f'Eliminando channel : {self.channel_name}')
        discard_channel_if_found(self.channel_layer, self.channel_name)
        print_pretty_groups(self.channel_layer.groups)

    def receive(self, text_data):
        data = json.loads(text_data)
        discard_channel_if_found(self.channel_layer, self.channel_name)
        if data['type'] == "group_creation":
            async_to_sync(self.channel_layer.group_add)(data['name'],self.channel_name)
        print_pretty_groups(self.channel_layer.groups)


    def chat_message(self, event):
        message = event['message']
        print('Hola')
        self.send(text_data=message)



# async_to_sync(self.channel_layer.group_add)(self.chat_name,self.channel_name)
# async_to_sync(self.channel_layer.group_send)(
#     self.chat_name,
#     {
#         'type' : 'chat_message',
#         'message' : text_data
#     }
# )