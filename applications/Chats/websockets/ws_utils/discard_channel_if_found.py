from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .print_pretty_groups import print_pretty_groups
def discard_channel_if_found(target_channel):
    """
        Recibe el canal que se desea buscar

        Si el canal es encontrado en algún grupo, lo elimina y retorna True
        Si el canal no es encontrado en ningún grupo, retorna False
    """

    # Recordar, que en este punto, si existe manera de eliminar presencia de channels
    # usando la key del grupo. Sin embargo, lo hacemos de esta manera para evitar posibles fallos
    # Ademas que esta manera no es tan ineficiente, comprobado
    print_pretty_groups()
    channel_layer = get_channel_layer()
    for group_name,channels in channel_layer.groups.copy().items():
        if target_channel in channels:
            print(f'{target_channel} x {group_name}')
            async_to_sync(channel_layer.group_discard)(group_name, target_channel)
            print_pretty_groups()
            return group_name
    return False