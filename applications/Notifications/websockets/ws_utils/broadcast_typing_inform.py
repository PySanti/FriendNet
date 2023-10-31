from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def broadcast_typing_inform(session_user_id, clicked_user_id, typing):
    """
        Se encargara de realizar las acciones necesarias para
        hacer el broadcast del typing_inform
    """
    async_to_sync(get_channel_layer().group_send)(
        str(clicked_user_id),
        {
            "type" : "broadcast_typing_inform_handler",
            "value" : {
                "user_id" : session_user_id,
                "typing" : typing
            }
        }
    )