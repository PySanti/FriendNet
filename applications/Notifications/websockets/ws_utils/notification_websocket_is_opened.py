from channels.layers import get_channel_layer
from django.core.cache import cache
def notification_websocket_is_opened(user_id):
    """
        Retornara True en caso de que exista algun grupo creado con el user_id como nombre
    """
    notifications_groups = cache.get("notifications")
    return str(user_id) in notifications_groups
