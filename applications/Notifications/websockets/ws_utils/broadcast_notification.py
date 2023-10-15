from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def broadcast_notification(receiver_id, newNotification):
    """
        Se encargara de hacer el broadcast de la newNotification al
        websocket del receiver_id

        Debe hacerse una comprobacion previa a su uso, para saber si el receiver
        tiene un channel abierto
    """
    async_to_sync(get_channel_layer().group_send)(str(receiver_id),
    {    
        'type' : 'broadcast_notification_handler',
        'value' : {
            "new_notification" : newNotification
    }})