from channels.layers import get_channel_layer
from .messages_group_name import messages_group_name
from django.core.cache import cache
def messages_group_is_full(id_1, id_2):
    """
        Recibe dos id's y retornara true en caso de que exista un grupo de mensajes con esos id's
        y que este full
    """
    messages_groups = cache.get("chats")
    return (messages_group_name(id_1, id_2) in messages_groups) and (len(messages_groups[messages_group_name(id_1, id_2)])==2)
