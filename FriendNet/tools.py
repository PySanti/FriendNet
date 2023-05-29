from json import load


def read_secret_data(env, secret_filename):
    with open(secret_filename, 'r') as f:
        info = load(f)
        SECRET_KEY = info['KEY']
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql_psycopg2',
                'NAME': info['LOCAL_DB'] if env == 'local' else info['PROD_DB'] ,
                'USER': info['USER'],
                'PASSWORD': info['PASSWORD'],
                'HOST': info['HOST'],
                'PORT': info['PORT'],
            }
        }
    return DATABASES, SECRET_KEY