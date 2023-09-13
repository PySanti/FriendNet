from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json

class MyConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'Generando conexion a channel -> {self.channel_name}')

    def disconnect(self, close_code):
        print('Desconectando websocket')

    def receive(self, text_data):
        print('-------')
        print('Mensaje recibido')
        data = json.loads(text_data)
        print('-------')
        for k,v in data.items():
            print(f"{k}->{v}")
        print('-------')
        if data['type'] == "group_creation":
            print(f'Agregando {self.channel_name} al grupo {data["name"]}')
            async_to_sync(self.channel_layer.group_add)(data['name'],self.channel_name)
        print('-------')
        print('Integrantes del grupo')
        print(self.channel_layer.channels)

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