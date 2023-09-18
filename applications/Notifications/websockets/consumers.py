from channels.generic.websocket import WebsocketConsumer



class NotificationsConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'-> Estableciendo conexion con websocket de notificaciones')

    def disconnect(self, close_code):
        print('-> Desconectando websocket de notificacion')

    def receive(self, text_data):
        print('Recibiendo info del front-end')



