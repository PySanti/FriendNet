from .consumers import MyConsumer
from django.urls import (
    path
)

websocket_urlpatterns = [
    path('ws/my_consumer/', MyConsumer.as_asgi()),
]