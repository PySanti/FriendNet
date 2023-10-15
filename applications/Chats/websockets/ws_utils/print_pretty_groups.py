from channels.layers import get_channel_layer
def print_pretty_groups():
    """
        Imprimira los grupos actuales almacenados en el channel layer
    """
    print(" ------------------------------------------------ ")
    print('Grupos')
    for k,v in get_channel_layer().groups.items():
        print(f'{k} -> {v}')