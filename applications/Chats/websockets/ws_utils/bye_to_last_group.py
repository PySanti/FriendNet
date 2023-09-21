from .discard_channel_if_found import discard_channel_if_found
from asgiref.sync import async_to_sync
from .group_info_dict import group_info_dict
def bye_to_last_group(consumer):
    """
        Esta funcion recibira el consumer del channel actual

        Se encargara de eliminar al canal actual de los grupos en los que se encuentre
        y, en caso de encontrarse, enviara un broadcast a ese grupo para informar que ya no esta full

        Esta funcion trabaja sobre discard_channel_if_found
    """
    last_group_name = discard_channel_if_found(consumer.channel_layer, consumer.channel_name)
    if last_group_name and (last_group_name in consumer.channel_layer.groups):
        async_to_sync(consumer.channel_layer.group_send)(last_group_name,group_info_dict(is_group_full=False))