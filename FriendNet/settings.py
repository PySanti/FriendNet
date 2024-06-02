"""
Django settings for FriendNet project.

Generated by 'django-admin startproject' using Django 4.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path

from datetime import timedelta
from .utils.read_secret_data import read_secret_data


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_FILE_PATH = BASE_DIR / 'secrets.json'
SECRETS = read_secret_data(SECRET_FILE_PATH)

# BASE CONFIGURATIONS



DEBUG = False

if (DEBUG):
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ]

else:
    BASE_ALLOWED_HOSTS = ['https://friendnet.netlify.app', 'friendnet.online', '64.23.156.104']
    ALLOWED_HOSTS = BASE_ALLOWED_HOSTS
    CORS_ALLOWED_ORIGINS = BASE_ALLOWED_HOSTS
    CORS_ORIGIN_ALLOW_ALL = False
    CORS_ORIGIN_WHITELIST = BASE_ALLOWED_HOSTS
    APPEND_SLASH = False

    # https settings
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True

    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_PRELOAD = True
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True





DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

LOCAL_APPS = [
    "applications.Usuarios",
    "applications.Chats",
    "applications.Notifications",
    "applications.RateLimit"
]

THIRD_PARTY_APPS = [
    "channels",
    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt.token_blacklist",
]
INSTALLED_APPS = LOCAL_APPS + DJANGO_APPS + THIRD_PARTY_APPS


SECRET_KEY = SECRETS['KEY']
WSGI_APPLICATION = 'FriendNet.wsgi.application'
ASGI_APPLICATION = 'FriendNet.asgi.application'  # new
DJANGO_MIDDLEWARES =  [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

LOCAL_MIDDLEWARES = [
    "applications.RateLimit.middlewares.RateLimitMiddleware"
]

MIDDLEWARE = DJANGO_MIDDLEWARES + LOCAL_MIDDLEWARES

ROOT_URLCONF = 'FriendNet.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'Usuarios.Usuarios'


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}



DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': SECRETS['LOCAL_DB'] if DEBUG else SECRETS['DEPLOY_DB'],
        'USER': SECRETS['USER'],
        'PASSWORD': SECRETS['PASSWORD'],
        'HOST': SECRETS['HOST'],
        'PORT': SECRETS['PORT'],
    }
}

CLOUDINARY_URL = f'cloudinary://{SECRETS["CLOUDINARY__API_KEY"]}:{SECRETS["CLOUDINARY__API_SECRET"]}@{SECRETS["CLOUDINARY__CLOUD_NAME"]}'    

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": ['redis://localhost:6379'],
            "expiry": 5,  # Expiración después de 1 hora (3600 segundos)
        },
    },
}
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',  # Change this according to your Redis server's URL & port
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'TIMEOUT' : None
    }
}



EMAIL_BACKEND       = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST          = 'smtp.gmail.com'
EMAIL_PORT          = 587
EMAIL_USE_TLS       = True
EMAIL_HOST_USER     = "friendnet.inc@gmail.com"
EMAIL_HOST_PASSWORD = SECRETS['EMAIL_PASSWORD']



# logging
if not DEBUG:
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'verbose': {
                'format': '{levelname} {asctime} {module} {message}',
                'style': '{',
            },
        },
        'handlers': {
            'file': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'filename': '/root/projects/FriendNet/logs/django.log',
                'formatter': 'verbose',
            },
            'websocket': {
                'level': 'INFO',
                'class': 'logging.FileHandler',
                'filename': '/root/projects/FriendNet/logs/websocket.log',
                'formatter': 'verbose',
            },
            'pingpong': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'filename': '/root/projects/FriendNet/logs/ping-pong.log',
                'formatter': 'verbose',
            },
            'ratelimit': {
                'level': 'WARNING',
                'class': 'logging.FileHandler',
                'filename': '/root/projects/FriendNet/logs/ratelimit.log',
                'formatter': 'verbose',
            },
        },
        'loggers': {
            'django': {
                'handlers': ['file'],
                'level': 'DEBUG',
                'propagate': True,
            },
            'django.channels': {
                'handlers': ['websocket'],
                'level': 'INFO',
                'propagate': True,
            },
            'pingpong_logger': {
                'handlers': ['pingpong'],
                'level': 'DEBUG',
                'propagate': False,
            },
            'ratelimit_logger': {
                'handlers': ['ratelimit'],
                'level': 'WARNING',
                'propagate': False,
            },
        },
    }