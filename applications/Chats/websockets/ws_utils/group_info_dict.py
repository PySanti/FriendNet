def group_info_dict(is_group_full):
    """
        Retorna el mensaje que sera enviado a los canales para
        informacion sobre los integrantes del grupo
    """
    return {
        'type' : 'group_info',
        'value' : {    
                "group" : "full" if is_group_full else "not_full"
            }
        }