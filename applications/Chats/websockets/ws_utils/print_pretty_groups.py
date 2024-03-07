from django.core.cache import cache
import logging

def print_pretty_groups():
    """
        Imprimira los grupos actuales almacenados en el channel layer
    """
    pass
    # logger = logging.getLogger('django.channels')
    # logger.info(" ------------------------------------------------ ")
    # modes = ["notifications", "chats"]
    # for m in modes:
    #     if (cache.get(m)):
    #         for k,v in cache.get(m).items():
    #             logger.info(f'{k} -> {v}')