from channels.generic.websocket import WebsocketConsumer

class MyConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(self.scope['user'])
        self.send(text_data="maderfoker")

    def disconnect(self, close_code):
        pass
    
    def receive(self, text_data):
        # Aquí puedes manejar los mensajes recibidos desde el cliente
        pass
