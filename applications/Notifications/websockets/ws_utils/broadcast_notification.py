from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .notifications_group_name import notifications_group_name

def broadcast_notification(id1, id2, newNotification):
    print(f'-> Haciendo broadcats de notificacion {newNotification["id"]}')
    channel_layer = get_channel_layer()
    group_name = notifications_group_name(id1, id2)
    try:
        channels = [list(channel_layer.groups[id_].keys())[0] for id_ in [str(id__) for id__ in [id1, id2]]]
    except KeyError:
        print('-> El receiver user no tiene channel abierto, no se ha hecho el broadcast ... ')
    else:
        async_to_sync(channel_layer.group_add)(group_name, channels[0])
        async_to_sync(channel_layer.group_add)(group_name,channels[1])
        async_to_sync(channel_layer.group_send)(group_name,{    'type' : 'broadcast_notification_handler',    'value' : {
            "type" : "new_notification",
            "new_notification" : newNotification
        }})
        async_to_sync(channel_layer.group_discard)(group_name, channels[0])
        async_to_sync(channel_layer.group_discard)(group_name, channels[1])