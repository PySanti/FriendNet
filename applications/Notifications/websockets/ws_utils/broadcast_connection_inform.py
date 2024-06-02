from .get_opened_chat_groups_with_id import get_opened_chat_groups_with_id
from channels.layers import get_channel_layer
import logging
from ..ws_utils.manage_groups import manage_groups
from applications.Usuarios.utils.constants import (
    BASE_CHATS_WEBSOCKETS_GROUP_NAME,
    BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME
)


logger = logging.getLogger('django.channels')
async def broadcast_connection_inform(user_id, connected):
    """
        Se encargara de realizar el broadcast del connection_inform:
        Le avisara a todos los grupos de mensajes abiertos con el id user_id
        que dicho id se acaba de conectar
    """
    channel_layer = get_channel_layer()
    opened_chat_groups = get_opened_chat_groups_with_id(str(user_id))
    if (opened_chat_groups):
        for group in opened_chat_groups:
            logger.info(f"Haciendo broadcast a {group} por connection inform")
            await channel_layer.group_send(group,{
            'type' : 'broadcast_connection_inform_handler',
            'value' : {
                "user_id" : user_id,
                "connected" : connected
            }
        })
    else:
        return
