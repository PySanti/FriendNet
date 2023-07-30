from .base import *
from ..utils.read_secret_data import read_secret_data

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

# Configuración del backend de correo electrónico
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# Configuración del servidor SMTP
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
# Credenciales de inicio de sesión del servidor SMTP
EMAIL_HOST_USER = SECRETS['EMAIL_USERNAME']
EMAIL_HOST_PASSWORD = SECRETS['EMAIL_PASSWORD']

CLOUDINARY_URL = f'cloudinary://{SECRETS["CLOUDINARY__API_KEY"]}:{SECRETS["CLOUDINARY__API_SECRET"]}@{SECRETS["CLOUDINARY__CLOUD_NAME"]}'    