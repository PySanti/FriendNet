from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def broadcast_notification(receiver_id, newNotification):
    print(f'-> Haciendo broadcats de notificacion {newNotification["id"]}')
    async_to_sync(get_channel_layer().group_send)(str(receiver_id),
    {    
        'type' : 'broadcast_notification',    
        'value' : {
            "new_notification" : newNotification
    }})