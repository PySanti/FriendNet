from .messages_group_name import messages_group_name
from .get_redis_groups import get_redis_groups

def messages_group_is_full(id_1, id_2):
    """
        Recibe dos id's y retornara true en caso de que exista un grupo de mensajes con esos id's
        y que este full
    """
    messages_groups = get_redis_groups("chats")
    return (messages_group_name(id_1, id_2) in messages_groups) and (len(messages_groups[messages_group_name(id_1, id_2)])==2)
