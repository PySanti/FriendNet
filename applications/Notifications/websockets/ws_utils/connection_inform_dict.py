def connection_inform_dict(user_id, connected):
    """
        Funcion creada para estandarizar el diccionario
        de mensaje de connection_inform
    """
    return {
        'type' : 'broadcast_connection_inform',
        'value' : {
            "user_id" : user_id,
            "connected" : connected
        }
    }