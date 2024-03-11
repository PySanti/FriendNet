from channels.layers import get_channel_layer
from django.core.cache import cache
from .manage_groups import manage_groups
from applications.Usuarios.utils.constants import BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME


def notification_websocket_is_opened(user_id):
    """
        Retornara True en caso de que exista algun grupo creado con el user_id como nombre
    """
    return str(user_id) in manage_groups("get", BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME)
