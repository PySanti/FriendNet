import logging

from .get_redis_groups import get_redis_groups

logger = logging.getLogger('django.channels')
def print_pretty_groups():
    """
        Imprimira los grupos actuales almacenados en el channel layer
    """
    logger.info("\t\t\t~~~\tMostrando grupos a partir de redis")
    logger.info(get_redis_groups("notifications"))
    logger.info(get_redis_groups("chats"))