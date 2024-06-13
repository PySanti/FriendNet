from .get_opened_chat_groups_with_id import get_opened_chat_groups_with_id
from channels.layers import get_channel_layer
import logging
from .get_redis_groups import get_redis_groups
from .print_pretty_groups import print_pretty_groups


logger = logging.getLogger('django.channels')
async def broadcast_connection_inform(user_id, connected):
    """
        Se encargara de realizar el broadcast del connection_inform:
        Le avisara a todos los grupos de mensajes abiertos con el id user_id
        que dicho id se acaba de conectar

        Retornara true en caso de que si se haga algun broadcast
    """
    broadcast_data =  {
            'type' : 'broadcast_connection_inform_handler',
            'value' : {
                "user_id" : user_id,
                "connected" : connected
            }
        }
    opened_chat_groups = get_opened_chat_groups_with_id(str(user_id))
    broadcast_executed = False
    if (opened_chat_groups):
        for group in opened_chat_groups:
            logger.info(f"Haciendo broadcast a {group}:{get_redis_groups('chats')[group]} por connection inform")
            await get_channel_layer().group_send(group, broadcast_data)
            broadcast_executed = True
    return broadcast_executed
