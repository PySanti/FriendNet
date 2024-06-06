from django.core.cache import cache
import logging
from .manage_groups import manage_groups
from datetime import datetime
from applications.Usuarios.utils.constants import (
    BASE_CHATS_WEBSOCKETS_GROUP_NAME,
    BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME
)
from .get_redis_groups import get_redis_groups

logger = logging.getLogger('django.channels')
def print_pretty_groups():
    """
        Imprimira los grupos actuales almacenados en el channel layer
    """
    modes = [BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME, BASE_CHATS_WEBSOCKETS_GROUP_NAME]
    for m in modes:
        current_group = manage_groups("get", m)
        if current_group:
            for k,v in current_group.items():
                logger.info(f'{k} -> {v}')
    
    logger.info("\t\t\t~~~\tMostrando grupos a partir de redis")
    logger.info(get_redis_groups("notifications"))
    logger.info(get_redis_groups("chats"))