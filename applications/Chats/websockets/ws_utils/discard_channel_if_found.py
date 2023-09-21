from asgiref.sync import async_to_sync
def discard_channel_if_found(channel_layer, target_channel):
    """
        Recibe el channel_layer y el canal que se desea buscar

        Si el canal es encontrado en algun grupo, lo elimina y retorna True
        Si el canal no es encontrado en nigun grupo, retorna False
    """
    for group_name,channels in channel_layer.groups.copy().items():
        if target_channel in channels:
            async_to_sync(channel_layer.group_discard)(group_name, target_channel)
            return group_name
    return False