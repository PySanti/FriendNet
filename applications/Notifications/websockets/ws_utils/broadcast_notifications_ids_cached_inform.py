from .get_opened_chat_groups_with_id import get_opened_chat_groups_with_id
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def broadcast_notifications_ids_cached_inform(session_user_id):
    """
        Funcion creada para avisar al front que las notifications_ids
        ya estan cacheadas y que ya puede llamar a la api para getUsersList
    """
    async_to_sync(get_channel_layer().group_send)(str(session_user_id),{
        'type' : 'broadcast_notifications_ids_cached_inform_handler',
    })