from channels.layers import get_channel_layer
def get_opened_chat_groups_with_id(target_id):
    """
        Retornara una lista de los grupos de chat que estan abiertos con el id del usuario
    """
    found_groups = []
    groups = get_channel_layer().groups
    for group_name, channels in groups.items():
        try:
            [id_1, id_2] = group_name.split('-')
            if (str(target_id) in [id_1, id_2]):
                found_groups.append(group_name)
        except ValueError:
            # en este caso estaremos evaluando un grupo para notificacion, entonces continuamos
            pass
    return found_groups