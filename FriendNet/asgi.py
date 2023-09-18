# mysite/asgi.py
import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from applications.Chats.websockets.routing import messages_websocket_urlpatterns
from applications.Notifications.websockets.routing import notifications_websocket_urlpatterns

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
                URLRouter(
                    messages_websocket_urlpatterns  +   
                    notifications_websocket_urlpatterns
                )
        ),
    }
)

