from .consumers import NotificationsConsumer
from django.urls import (
    path
)

notifications_websocket_urlpatterns = [
    path('ws/notifications/', NotificationsConsumer.as_asgi()),
]