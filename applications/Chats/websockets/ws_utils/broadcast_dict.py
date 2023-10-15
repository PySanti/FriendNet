def broadcast_dict(broadcast_type, broadcast_value=None):
    """
        Retornara un diccionario para envio de mensajes a traves de websockets

        Funcion creada para que todos los mensajes tengan el mismo formato
    """
    return {"type" : broadcast_type,"value" : broadcast_value} if broadcast_value else {"type" : broadcast_type}