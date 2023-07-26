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
# exception Handling 
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'applications.Usuarios.utils.custom_exception_handler.custom_exception_handler'
}

