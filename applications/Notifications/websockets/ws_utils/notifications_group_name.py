def notifications_group_name(id1, id2):
    """
        Recibe dos id's y retorna el nombre de un grupo de notificaciones
        para ambos siguiendo el estandar establecido
    """
    return f"{id1}-{id2}" if id1 > id2 else f"{id2}-{id1}"