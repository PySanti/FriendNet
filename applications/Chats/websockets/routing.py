from .consumers import ChatWSConsumer
from django.urls import (
    path
)

chat_websocket_urlpatterns = [
    path('wss/chat/', ChatWSConsumer.as_asgi()),
]