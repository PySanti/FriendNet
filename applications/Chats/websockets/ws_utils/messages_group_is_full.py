from channels.layers import get_channel_layer
from .messages_group_name import messages_group_name
def messages_group_is_full(id_1, id_2):
    """
        Recibe dos id's y retornara true en caso de que exista un grupo de mensajes con esos id's
        y que este full
    """
    if messages_group_name(id_1, id_2) in get_channel_layer().groups:
        return len(get_channel_layer().groups[messages_group_name(id_1, id_2)])==2
    else:
        return False
