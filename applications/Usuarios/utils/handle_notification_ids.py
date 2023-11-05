from django.core.cache import cache

def handle_notification_ids(method, session_user_id, notification_ids=None):
    """
        Funcion creada para manejar las notification_ids del
        usuario duenio de la sesion al logearse.
    """
    cache_key = f'intial_notification_ids_{session_user_id}'
    method = method.lower()
    if (method not in ['get', 'post', 'delete']):
        raise Exception('Mal uso de la funcion handle_notification_ids')
    if (method == 'get'):
        return cache.get(cache_key)
    elif (method == 'post'):
        if not notification_ids:
            raise Exception('Error, no se envió el notification_ids a la función handle_notification_ids')
        cache.set(cache_key, notification_ids)
    elif (method == 'delete'):
        cache.delete(cache_key)