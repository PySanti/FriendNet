from .get_redis_groups import get_redis_groups


def get_opened_chat_groups_with_id(target_id):
    """
        Retornara una lista de los grupos de chat que estan abiertos con el id del usuario
    """
    groups = get_redis_groups("chats")
    return [g for g in groups.keys() if str(target_id) in g.split('-')] if groups else None