from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class MyConsumer(WebsocketConsumer):
    def connect(self):
        print(f'Nombre del canal {self.channel_name}')
        self.accept()
        self.chat_name = 'test'
        async_to_sync(self.channel_layer.group_add)(self.chat_name,self.channel_name)
        self.send(text_data="maderfoker")

    def disconnect(self, close_code):
        print('Desconectando websocket')

    def receive(self, text_data):
        print('RECIBIENDOOOO')
        self.send(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.chat_name,
            {
                'type' : 'chat_message',
                'message' : text_data
            }
        )

    def chat_message(self, event):
        message = event['message']
        print('Hola')
        self.send(text_data=message)