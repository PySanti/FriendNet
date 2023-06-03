from .base import *
import os
from ..tools import read_secret_data

DEBUG = True
ALLOWED_HOSTS = []
SECRETS = read_secret_data('local', SECRET_FILE_PATH)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': SECRETS['LOCAL_DB'],
        'USER': SECRETS['USER'],
        'PASSWORD': SECRETS['PASSWORD'],
        'HOST': SECRETS['HOST'],
        'PORT': SECRETS['PORT'],
    }
}
SECRET_KEY = SECRETS['KEY']
MEDIA_URL = 'media/'  
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')  
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = SECRETS['EMAIL_USER']
EMAIL_HOST_PASSWORD = SECRETS['EMAIL_PASSWORD']
EMAIL_PORT = 587