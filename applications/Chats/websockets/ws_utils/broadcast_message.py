from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .messages_group_name import messages_group_name

def broadcast_message(id1, id2, message):
    """
        Se encargara de hacer el broadcast del mensaje
    """
    async_to_sync(get_channel_layer().group_send)(messages_group_name(id1, id2),{'type' : 'broadcast_message_handler','value' : message})