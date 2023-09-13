from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json

class MessagesConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'Generando conexion a channel -> {self.channel_name}')

    def disconnect(self, close_code):
        print('Desconectando websocket')

    def receive(self, text_data):
        data = json.loads(text_data)
        print(f'Comprobando si este canal se encuentra en algun otro grupo')
        for k,v in self.channel_layer.groups.copy().items():
            if self.channel_name in v:
                print('Si lo hace')
                async_to_sync(self.channel_layer.group_discard)(k,self.channel_name)

        if data['type'] == "group_creation":
            async_to_sync(self.channel_layer.group_add)(data['name'],self.channel_name)
        print('-------')
        print('Integrantes del grupo')
        for k,v in self.channel_layer.groups.items():
            print(f'{k} -> {v}')

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