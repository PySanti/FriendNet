from channels.generic.websocket import WebsocketConsumer

class MyConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(text_data="maderfoker")

    def disconnect(self, close_code):
        pass
    
    def receive(self, text_data):
        print('RECIBIENDOOOO')
        self.send(text_data)
        pass
