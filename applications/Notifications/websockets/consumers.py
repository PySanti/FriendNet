import time
from channels.generic.websocket import WebsocketConsumer
import logging
from asgiref.sync import async_to_sync
from applications.Chats.websockets.ws_utils.print_pretty_groups import print_pretty_groups
import json
from .ws_utils.broadcast_connection_inform import broadcast_connection_inform
from applications.Chats.websockets.ws_utils.broadcast_dict import broadcast_dict
from .ws_utils.broadcast_typing_inform import broadcast_typing_inform
from .ws_utils.notification_websocket_is_opened import notification_websocket_is_opened
from applications.Usuarios.utils.handle_initial_notification_ids import handle_initial_notification_ids
from .ws_utils.manage_notifications_groups import manage_notifications_groups


logger = logging.getLogger('django.channels')

class NotificationsWSConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        user_id = str(self.scope['url_route']['kwargs']['user_id'])
        groups = manage_notifications_groups("get")
        logger.info(f'-> Conectando websocket de notificacion, {user_id}')

        if ((user_id not in groups) or ((user_id in groups) and (self.channel_name not in groups[user_id]))):
            async_to_sync(self.channel_layer.group_add)(user_id,self.channel_name)
            groups = manage_notifications_groups('append', {"user_id" : user_id, "channel_name" : self.channel_name})

            if len(groups[user_id])>1:
                async_to_sync(self.channel_layer.group_send)(user_id,{"type" : "broadcast_connection_error_handler"})
            else:
                broadcast_connection_inform(user_id=user_id, connected=True)
            print_pretty_groups()

    def disconnect(self, close_code):
        user_id = str(self.scope['url_route']['kwargs']['user_id'])
        logger.info(f'-> Desconectando websocket de notificacion, {user_id}')

        
        if (user_id in manage_notifications_groups("get")):
            async_to_sync(self.channel_layer.group_discard)(user_id, self.channel_name)
            handle_initial_notification_ids('delete', user_id )
            manage_notifications_groups('delete', {"user_id" : user_id, "channel_name" : self.channel_name})
            broadcast_connection_inform(user_id=user_id, connected=False)

            print_pretty_groups()

    def receive(self, text_data):
        data = json.loads(text_data)
        if (data["type"] == "typing_inform"):
            value = data["value"]
            if notification_websocket_is_opened(value["clicked_user_id"]):
                broadcast_typing_inform(**value)


    def broadcast_typing_inform_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="typing_inform", broadcast_value=event["value"])))
    def broadcast_notification_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="new_notification", broadcast_value=event["value"])))
    def broadcast_connection_error_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="connection_error")))
    def broadcast_updated_user_handler(self, event):
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="updated_user", broadcast_value=event["value"])))

