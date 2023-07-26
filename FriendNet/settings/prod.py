from .base import *
from ..utils.read_secret_data import read_secret_data

DEBUG = False
ALLOWED_HOSTS = []

DATABASES, SECRET_KEY = read_secret_data('prod', SECRET_FILE_PATH)