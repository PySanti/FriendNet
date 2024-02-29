# mysite/asgi.py
import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from applications.Chats.websockets.routing import chat_websocket_urlpatterns
from applications.Notifications.websockets.routing import notifications_websocket_urlpatterns
import os
import django
from channels.routing import get_default_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", f'FriendNet.settings')
django.setup()



application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
                URLRouter(
                    chat_websocket_urlpatterns  +   
                    notifications_websocket_urlpatterns
                )
        ),
    }
)


application = get_default_application()