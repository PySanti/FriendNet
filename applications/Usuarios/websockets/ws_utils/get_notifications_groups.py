from django.core.cache import cache
from channels.layers import get_channel_layer
from applications.Notifications.websockets.ws_utils.manage_groups import manage_groups
from applications.Usuarios.utils.constants import BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME
def get_notifications_groups(session_user_id):
    """
        Retornara la lista de los nombres de los actuales canales de
        notificaciones abiertos exceptuando el canal del session_user
    """
    opened_notifications_websockets = []
    notifications_groups = manage_groups("get", BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME)
    for group_name, channels in notifications_groups.items():
        if (str(session_user_id) != group_name) and (len(group_name.split('-')) == 1):
            opened_notifications_websockets.append(group_name)
    return opened_notifications_websockets
