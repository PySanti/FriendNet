from channels.layers import get_channel_layer
def notification_wesocket_is_opened(user_id):
    """
        Retornara True en caso de que exista algun grupo creado con el user_id como name
    """
    return str(user_id) in get_channel_layer().groups
