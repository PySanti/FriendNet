def get_opened_groups_with_id(target_id, groups):
    """
        Retornara una lista de los grupos que estan abiertos con el id del usuario
    """
    found_groups = []
    for group_name, channels in groups.items():
        [id_1, id_2] = group_name.split('-')
        if (target_id in [id_1, id_2]):
            found_groups.append(group_name)