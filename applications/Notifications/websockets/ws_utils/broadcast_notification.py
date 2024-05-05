from channels.layers import get_channel_layer

async def broadcast_notification(receiver_id, newNotification):
    """
        Se encargara de hacer el broadcast de la newNotification al
        websocket del receiver_id

        Debe hacerse una comprobacion previa a su uso, para saber si el receiver
        tiene un channel abierto
    """
    await get_channel_layer().group_send(str(receiver_id),
    {    
        'type' : 'broadcast_notification_handler',
        'value' : {
            "new_notification" : newNotification,
    }})