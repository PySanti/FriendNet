from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .ws_utils.print_pretty_groups import print_pretty_groups
import json
from .ws_utils.broadcast_dict import broadcast_dict
from .ws_utils.messages_group_name import messages_group_name
from .ws_utils.manage_chat_groups import manage_chat_groups
import logging

logger = logging.getLogger('django.channels')

class ChatWSConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        print(f'Generando conexion a channel -> {self.channel_name}')
    
    def _discard_channel_from_groups(self):
        async_to_sync(self.channel_layer.group_discard)(self.scope["group_name"], self.channel_name)
        manage_chat_groups("discard", {"group_name" : self.scope["group_name"] , "channel_name" : self.channel_name})
        self.scope["group_name"] = None

    def disconnect(self, close_code):
        if ("group_name" in self.scope and self.scope["group_name"]):
            logging.info(f"Desconectando websocket de chat, {self.scope["group_name"]}:{self.channel_name[-2:]}")
            self._discard_channel_from_groups()
        print_pretty_groups()

    def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == "group_creation":
            if (("group_name" in self.scope) and self.scope["group_name"]):
                self._discard_channel_from_groups()
            self.scope["group_name"] = messages_group_name(data['value']['session_user_id'], data['value']['clicked_user_id'])

            groups = manage_chat_groups("get")
            group_name = self.scope["group_name"]
            if (((group_name in groups) and (self.channel_name not in groups[group_name])) or (group_name not in groups)):
                logging.info(f"Agregando websocket de chat, {self.scope["group_name"]}:{self.channel_name[-2:]}")
                async_to_sync(self.channel_layer.group_add)(self.scope["group_name"],self.channel_name)
                manage_chat_groups("append", {"group_name" : self.scope["group_name"] , "channel_name" : self.channel_name})

        if data['type'] == "group_delete":
            self._discard_channel_from_groups()
        print_pretty_groups()


    def broadcast_message_handler(self, event):
        """
            Método a ejecutar para transmitir un mensaje en un grupo
        """
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="message_broadcast", broadcast_value=event["value"])))
    def broadcast_connection_inform_handler(self, event):
        """
            Método a ejecutar para informar a integrante del grupo que el otro se conecto
        """
        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="connection_inform", broadcast_value=event["value"])))

