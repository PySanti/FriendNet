from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .ws_utils.discard_channel_if_found import discard_channel_if_found
import json


class MessagesConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'Generando conexion a channel -> {self.channel_name}')
    def print_groups(self):
        print("~~~~~~~~~")
        print('Grupos')
        for k,v in self.channel_layer.groups.items():
            print(f'{k} -> {v}')
        print("~~~~~~~~~")

    def disconnect(self, close_code):
        print('Desconectando websocket')
        discard_channel_if_found(self.channel_layer, self.channel_name)

    def receive(self, text_data):
        data = json.loads(text_data)
        discard_channel_if_found(self.channel_layer, self.channel_name)

        if data['type'] == "group_creation":
            async_to_sync(self.channel_layer.group_add)(data['name'],self.channel_name)
        self.print_groups()


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