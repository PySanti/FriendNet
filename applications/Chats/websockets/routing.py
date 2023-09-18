from .consumers import MessagesConsumer
from django.urls import (
    path
)

messages_websocket_urlpatterns = [
    path('ws/messages/', MessagesConsumer.as_asgi()),
]