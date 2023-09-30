from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .messages_group_name import messages_group_name

def broadcast_message(id1, id2, message):
    """
        Se encargara de hacer el broadcast del mensaje, 
        En caso de que no pueda, retornara False
    """
    channel_layer = get_channel_layer()
    group_name = messages_group_name(id1, id2)
    if (group_name in channel_layer.groups) and (len(channel_layer.groups[group_name]) == 2):
        async_to_sync(channel_layer.group_send)(group_name,{'type' : 'broadcast_message_handler','value' : message})
        return True
    return False