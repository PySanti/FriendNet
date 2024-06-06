from .get_opened_chat_groups_with_id import get_opened_chat_groups_with_id
from channels.layers import get_channel_layer
import logging
from ..ws_utils.manage_groups import manage_groups
from applications.Usuarios.utils.constants import (
    BASE_CHATS_WEBSOCKETS_GROUP_NAME,
    BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME
)
import redis

def get_groups():
    logger.info("Accediendo a registros reales de channels")
    r = redis.Redis(host='localhost', port=6379, db=0)
    for k in r.keys():
        logger.info(k)
        value_type = r.type(k)
        if value_type == 'string':
            print(r.get(k))
        elif value_type == 'list':
            print(r.lrange(k, 0, -1))
        elif value_type == 'set':
            print(r.smembers(k))
        elif value_type == 'hash':
            print(r.hgetall(k))
        elif value_type == b'zset':
            logger.info(r.zrange(k, 0, -1))
        else:
            print(f"Tipo de valor no soportado: {value_type}")


logger = logging.getLogger('django.channels')
async def broadcast_connection_inform(user_id, connected):
    """
        Se encargara de realizar el broadcast del connection_inform:
        Le avisara a todos los grupos de mensajes abiertos con el id user_id
        que dicho id se acaba de conectar
    """
    channel_layer = get_channel_layer()
    opened_chat_groups = get_opened_chat_groups_with_id(str(user_id))
    get_groups()
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
