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

CLOUDINARY_URL = f'cloudinary://{SECRETS["CLOUDINARY__API_KEY"]}:{SECRETS["CLOUDINARY__API_SECRET"]}@{SECRETS["CLOUDINARY__CLOUD_NAME"]}'    