from django.core.cache import cache
def print_pretty_groups():
    """
        Imprimira los grupos actuales almacenados en el channel layer
    """
    print(" ------------------------------------------------ ")
    print('Grupos')
    modes = ["notifications", "chats"]
    for m in modes:
        if (cache.get(m)):
            for k,v in cache.get(m).items():
                print(f'{k} -> {v}')