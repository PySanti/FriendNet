from applications.Notifications.websockets.ws_utils.get_redis_groups import get_redis_groups

def get_notifications_groups(session_user_id : int):
    """
        Retornara la lista de los nombres de los actuales canales de
        notificaciones abiertos exceptuando el canal del session_user
    """
    notifications_groups = get_redis_groups("notifications")
    return [g for g in notifications_groups.keys() if str(session_user_id) != g ]

