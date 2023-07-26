from json import load
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent


def load_cloudinary_secrets():
    """
        Retorna los parametros de autenticacion necesarios  para realizar
        acciones con cloudinary
    """
    info = {}
    with open(f'{BASE_DIR}/secrets.json','r') as f:
        info = load(f)
    return info