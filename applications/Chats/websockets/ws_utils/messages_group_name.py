def messages_group_name(id1, id2):
    """
        Recibe dos id's y retorna el nombre de un grupo creado por ambos siguiendo
        los estandares de messages_groups
    """
    return f"{id1}-{id2}" if id1 < id2 else f"{id2}-{id1}"