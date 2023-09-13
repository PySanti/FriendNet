def print_pretty_groups(groups):
    print("~~~~~~~~~")
    print('Grupos')
    for k,v in groups.items():
        print(f'{k} -> {v}')
    print("~~~~~~~~~")