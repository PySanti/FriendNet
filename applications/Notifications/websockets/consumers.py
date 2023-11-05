from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from applications.Chats.websockets.ws_utils.print_pretty_groups import print_pretty_groups
import json
from applications.Chats.websockets.ws_utils.discard_channel_if_found import discard_channel_if_found
from .ws_utils.broadcast_connection_inform import broadcast_connection_inform
from applications.Chats.websockets.ws_utils.broadcast_dict import broadcast_dict
from .ws_utils.broadcast_typing_inform import broadcast_typing_inform
from .ws_utils.notification_websocket_is_opened import notification_websocket_is_opened
from applications.Usuarios.utils.handle_initial_notification_ids import handle_initial_notification_ids
from applications.Usuarios.models import Usuarios
from .ws_utils.broadcast_notifications_ids_cached_inform import broadcast_notifications_ids_cached_inform

class NotificationsWSConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'-> Estableciendo conexion con websocket de notificaciones')

    def disconnect(self, close_code):
        print('-> Desconectando websocket de notificacion')
        group_name = discard_channel_if_found(self.channel_name)
        handle_initial_notification_ids('delete', group_name )
        broadcast_connection_inform(user_id=group_name, connected=False)

    def receive(self, text_data):
        data = json.loads(text_data)
        if (data["type"] == "group_creation"):
            async_to_sync(self.channel_layer.group_add)(str(data['value']['name']),self.channel_name)
            if len(self.channel_layer.groups[str(data['value']["name"])])>1:
                async_to_sync(self.channel_layer.group_send)(str(data['value']["name"]),{"type" : "broadcast_connection_error_handler"})
            else:
                session_user = Usuarios.objects.get(id=int(data['value']['name']))
                initial_notifications_list = [a['sender_user_id'] for a in list(session_user.notifications.values('sender_user_id'))] 
                handle_initial_notification_ids('post', session_user.id,initial_notifications_list )
                broadcast_notifications_ids_cached_inform(session_user.id)
                broadcast_connection_inform(user_id=data['value']["name"], connected=True)
        if (data["type"] == "typing_inform"):
            value = data["value"]
            if notification_websocket_is_opened(value["clicked_user_id"]):
                broadcast_typing_inform(**value)
        print_pretty_groups()

    def broadcast_typing_inform_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="typing_inform", broadcast_value=event["value"])))
    def broadcast_notifications_ids_cached_inform_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="notifications_ids_cached_inform")))
    def broadcast_notification_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="new_notification", broadcast_value=event["value"])))
    def broadcast_connection_error_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="connection_error")))
    def broadcast_updated_user_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="updated_user", broadcast_value=event["value"])))

