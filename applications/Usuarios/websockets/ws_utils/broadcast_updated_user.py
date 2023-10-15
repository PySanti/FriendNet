from channels.layers import get_channel_layer
from applications.Usuarios.utils.constants import USERS_LIST_ATTRS
from asgiref.sync import async_to_sync
from .get_notifications_groups import get_notifications_groups

def broadcast_updated_user(updated_user):
    """
        Se encargara de realizar el broadcast a todos los grupos de notificaciones
        cuando el usuario se actualice
    """
    for group in get_notifications_groups(updated_user.id):
        async_to_sync(get_channel_layer().group_send)(
            group,{
                'type' : 'broadcast_updated_user_handler',
                'value' : {i[0]:i[1] for i in updated_user.__dict__.items() if i[0] in USERS_LIST_ATTRS}
            }
        )