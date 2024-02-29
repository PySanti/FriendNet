from .consumers import ChatWSConsumer
from django.urls import (
    path
)

chat_websocket_urlpatterns = [
    path('ws/chat/', ChatWSConsumer.as_asgi()),
]