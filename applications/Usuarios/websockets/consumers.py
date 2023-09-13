from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class MyConsumer(WebsocketConsumer):
    def connect(self):
        self.chat_name = 'test'
        async_to_sync(self.channel_layer.group_add)(
            self.chat_name,
            self.channel_name
        )
        self.accept()
        self.send(text_data="maderfoker")

    def disconnect(self, close_code):
        pass
    
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
        pass

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=message)