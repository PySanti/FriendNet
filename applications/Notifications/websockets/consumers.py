from django.core.cache import cache
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from datetime import datetime
import json
from .ws_utils.broadcast_connection_inform import broadcast_connection_inform
from .ws_utils.broadcast_typing_inform import broadcast_typing_inform
from .ws_utils.notification_websocket_is_opened import notification_websocket_is_opened
from applications.Usuarios.utils.handle_initial_notification_ids import handle_initial_notification_ids
from .ws_utils.print_pretty_groups import print_pretty_groups
from .ws_utils.broadcast_dict import broadcast_dict
from .ws_utils.messages_group_name import messages_group_name
from .ws_utils.get_redis_groups import get_redis_groups

logger_channels = logging.getLogger('django.channels')
logger_ping_pong = logging.getLogger('pingpong_logger')

class NotificationsWSConsumer(AsyncWebsocketConsumer):

    async def send_ping(self):
        while True:
            last_pong_timediff = (datetime.now() - self.last_pong).total_seconds()
            user_id = str(self.scope['url_route']['kwargs']['user_id'])
            logger_ping_pong.info(f"{user_id}, Enviando ping. Pong diff : {last_pong_timediff}")
            if (last_pong_timediff > (self.ping_timing*2 + self.ping_timing/3)):
                await self.disconnect(-1)
                break
            else:
                await self.send(text_data=json.dumps({
                    'type': 'ping',
                }))
                await asyncio.sleep(self.ping_timing)

    async def _discard_channel_from_groups(self):
        if (("group_name" in self.scope) and self.scope["group_name"]):
            logger_channels.info(f"Eliminando websocket de chat, {self.scope['group_name']}:{self.channel_name}")
            await self.channel_layer.group_discard(self.scope["group_name"], self.channel_name)
            self.scope["group_name"] = None
    
    async def _cancel_ping_task(self, user_id):
        self.ping_task.cancel()
        try:
            await asyncio.wait_for(self.ping_task, timeout=5)
        except (asyncio.CancelledError, asyncio.TimeoutError):
            logger_ping_pong.info(f'Tarea de ping cancelada para el usuario {user_id}')
        else:
            logger_ping_pong.info(f'TAREA DE PING NO FUE CANCELADA para el usuario {user_id}')
    async def connect(self):
        self.scope["group_name"] = None
        await self.accept()
        user_id = str(self.scope['url_route']['kwargs']['user_id'])
        groups = get_redis_groups("notifications")
        logger_channels.info(f'-> Conectando websocket de notificacion, {user_id}')
        if ((user_id not in groups) or ((user_id in groups) and (self.channel_name not in groups[user_id]))):

            if (user_id in groups) and len(groups[user_id]) > 0:
                logger_channels.info("Channel existente detectado, aplicando substitucion de channels")
                await self.channel_layer.group_send(user_id,{"type" : "broadcast_connection_error_handler"})

            await self.channel_layer.group_add(user_id,self.channel_name)

            await broadcast_connection_inform(user_id=user_id, connected=True)
            print_pretty_groups()
            self.ping_timing = 30
            self.ping_task = asyncio.create_task(self.send_ping(), name="ping-task")
            self.last_pong = datetime.now()

    async def disconnect(self, close_code):
        user_id = str(self.scope['url_route']['kwargs']['user_id'])
        logger_channels.info(f'-> Desconectando websocket , {user_id}:{self.channel_name}')
        await self._cancel_ping_task(user_id)
        await self._discard_channel_from_groups()
        if (user_id in get_redis_groups("notifications")):
            logger_channels.info("-> La desconexion si se dara")
            await self.channel_layer.group_discard(user_id, self.channel_name)
            notifications_groups = get_redis_groups("notifications")
            if ((user_id not in notifications_groups) or (len(notifications_groups[user_id]) == 0)):
                handle_initial_notification_ids('delete', user_id )
                cache.delete(f"message_pagination_ref_{user_id}")
                await broadcast_connection_inform(user_id=user_id, connected=False)
        print_pretty_groups()
        return await super().disconnect(close_code)



    async def receive(self, text_data):
        data = json.loads(text_data)
        user_id = int(self.scope['url_route']['kwargs']['user_id'])
        # not
        if (data["type"] == "typing_inform"):
            value = data["value"]
            if notification_websocket_is_opened(value["clicked_user_id"]):
                await broadcast_typing_inform(user_id, **value)


        # chat
        if data['type'] == "group_creation":
            await self._discard_channel_from_groups()
            self.scope["group_name"] = messages_group_name(user_id, data['value']['clicked_user_id'])

            groups = get_redis_groups("chats")
            group_name = self.scope["group_name"]
            if (((group_name in groups) and (self.channel_name not in groups[group_name])) or (group_name not in groups)):
                logger_channels.info(f"Agregando websocket de chat, {self.scope['group_name']}:{self.channel_name}")
                await self.channel_layer.group_add(self.scope["group_name"],self.channel_name)

        if data['type'] == "group_delete":
            await self._discard_channel_from_groups()
        
        if data['type'] == "pong":
            self.last_pong = datetime.now()
            logger_ping_pong.info(f"{user_id}, Recibiendo pong : {self.last_pong}")
        print_pretty_groups()

    async def broadcast_typing_inform_handler(self, event):
        await self.send(text_data=json.dumps(broadcast_dict(broadcast_type="typing_inform", broadcast_value=event["value"])))
    async def broadcast_notification_handler(self, event):
        await self.send(text_data=json.dumps(broadcast_dict(broadcast_type="new_notification", broadcast_value=event["value"])))
    async def broadcast_connection_error_handler(self, event):
        logger_channels.info(f"----------------------------------------- Alcance de broadcast_connection_error : {self.channel_name}")
        try:
            await self.send(text_data=json.dumps(broadcast_dict(broadcast_type="connection_error")))
        except:
            logger_channels.info(f"----------------------------------------- Fallo al enviar 'broadcast_connection_error'")
        await self.disconnect(-1)
    async def broadcast_updated_user_handler(self, event):
        await self.send(text_data=json.dumps(broadcast_dict(broadcast_type="updated_user", broadcast_value=event["value"])))
    async def broadcast_message_handler(self, event):
        await self.send(text_data=json.dumps(broadcast_dict(broadcast_type="message_broadcast", broadcast_value=event["value"])))
    async def broadcast_connection_inform_handler(self, event):
        logger_channels.info("Broadcast connection inform exitoso !!")
        await self.send(text_data=json.dumps(broadcast_dict(broadcast_type="connection_inform", broadcast_value=event["value"])))




