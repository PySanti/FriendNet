# mysite/asgi.py
import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
import os
import django
from applications.Notifications.websockets.routing import notifications_websocket_urlpatterns
from applications.Notifications.websockets.consumers import NotificationsWSConsumer
from django.urls import re_path
from decouple import config


os.environ.setdefault("DJANGO_SETTINGS_MODULE", f'{config("PROJECT_NAME")}.settings')
django.setup()

# application = get_default_application()


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
                URLRouter(
                    notifications_websocket_urlpatterns
                )
        ),
    }
)

