from channels.layers import get_channel_layer
def print_pretty_groups():
    print("~~~~~~~~~")
    print('Grupos')
    for k,v in get_channel_layer().groups.items():
        print(f'{k} -> {v}')
    print("~~~~~~~~~")