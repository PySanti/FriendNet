from .base import *
from ..tools import read_secret_data

DEBUG = True
ALLOWED_HOSTS = []
DATABASES, SECRET_KEY = read_secret_data('local', SECRET_FILE_PATH)