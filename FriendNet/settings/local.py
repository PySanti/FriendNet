from .base import *
import os
from ..tools import read_secret_data

DEBUG = True
ALLOWED_HOSTS = []
DATABASES, SECRET_KEY = read_secret_data('local', SECRET_FILE_PATH)
MEDIA_URL = 'media/'  
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')  