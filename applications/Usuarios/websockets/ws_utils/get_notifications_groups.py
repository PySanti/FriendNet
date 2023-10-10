from channels.layers import get_channel_layer
def get_notifications_groups(session_user_id):
    """
        Retornara la lista de los nombres de los actuales canales de
        notificaciones abiertos exceptuando el canal del session_user
    """
    notifications_groups = []
    for group_name, channels in get_channel_layer().groups.items():
        if (str(session_user_id) != group_name) and (len(group_name.split('-')) == 1):
            notifications_groups.append(group_name)
    return notifications_groups
