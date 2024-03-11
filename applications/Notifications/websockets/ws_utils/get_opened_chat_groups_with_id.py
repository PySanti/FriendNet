from channels.layers import get_channel_layer
from django.core.cache import cache
from .manage_groups import manage_groups
from applications.Usuarios.utils.constants import BASE_CHATS_WEBSOCKETS_GROUP_NAME


def get_opened_chat_groups_with_id(target_id):
    """
        Retornara una lista de los grupos de chat que estan abiertos con el id del usuario
    """
    found_groups = []
    groups = manage_groups("get", BASE_CHATS_WEBSOCKETS_GROUP_NAME)
    if (groups):
        for group_name, channels in groups.items():
            try:
                [id_1, id_2] = group_name.split('-')
                if (str(target_id) in [id_1, id_2]):
                    found_groups.append(group_name)
            except ValueError:
                # en este caso estaremos evaluando un grupo para notificacion, entonces continuamos
                pass
        return found_groups
    else:
        return None