from .consumers import NotificationsWSConsumer
from django.urls import (
    path
)

notifications_websocket_urlpatterns = [
    path('ws/notifications/', NotificationsWSConsumer.as_asgi()),
]