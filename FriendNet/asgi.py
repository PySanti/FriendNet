# mysite/asgi.py
import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from applications.Usuarios.websockets.routing import websocket_urlpatterns
from applications.Usuarios.websockets.wsauthenticator import TokenAuthMiddleware

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
            
                URLRouter(
                    websocket_urlpatterns
                )
        
        ),
    }
)

