from .get_redis_groups import get_redis_groups


def notification_websocket_is_opened(user_id):
    """
        Retornara True en caso de que exista algun grupo creado con el user_id como nombre
    """
    return str(user_id) in get_redis_groups("notifications")
