from json import load


def read_secret_data(secret_filename):
    with open(secret_filename, 'r') as f:
        info = load(f)
    return info