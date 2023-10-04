from .get_opened_groups_with_id import get_opened_groups_with_id
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .connection_inform_dict import connection_inform_dict

def broadcast_connection_inform(user_id, connected):
    """
        Se encargara de realizar el broadcast del connection_inform:
        Le avisara a todos los grupos de mensajes abiertos con el id user_id
        que dicho id se acaba de conectar
    """
    channel_layer = get_channel_layer()
    for group in get_opened_groups_with_id(str(user_id), channel_layer.groups):
        async_to_sync(channel_layer.group_send)(group,connection_inform_dict(str(user_id), connected=connected))
