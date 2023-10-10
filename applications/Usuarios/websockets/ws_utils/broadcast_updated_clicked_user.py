from channels.layers import get_channel_layer
from applications.Usuarios.utils.constants import USERS_LIST_ATTRS
from applications.Notifications.websockets.ws_utils.get_opened_groups_with_id import get_opened_groups_with_id
from asgiref.sync import async_to_sync

def broadcast_updated_clicked_user(updated_user):
    """
        Se encargara de realizar el broadcast a todos los grupos de notificaciones
        cuando el usuario se actualice
    """
    for group in get_opened_groups_with_id(updated_user.id):
        async_to_sync(get_channel_layer().group_send)(
            group,{
                'type' : 'broadcast_updated_clicked_user',
                'value' : {i[0]:i[1] for i in updated_user.__dict__.items() if i[0] in USERS_LIST_ATTRS}
            }
        )