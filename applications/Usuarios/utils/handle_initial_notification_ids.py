from django.core.cache import cache

def handle_initial_notification_ids(method, session_user_id, notification_ids=None):
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
        cache.set(cache_key, notification_ids)
    elif (method == 'delete'):
        cache.delete(cache_key)