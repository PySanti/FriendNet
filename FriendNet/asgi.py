# mysite/asgi.py
import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
import os
import django
from applications.Notifications.websockets.consumers import NotificationsWSConsumer
from django.urls import re_path



os.environ.setdefault("DJANGO_SETTINGS_MODULE", f'FriendNet.settings')
django.setup()

# application = get_default_application()


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
                URLRouter(
                    [re_path(f'ws/notifications/(?P<user_id>\w+)', NotificationsWSConsumer.as_asgi())],
                )
        ),
    }
)

