from .consumers import NotificationsWSConsumer

from django.urls import re_path

notifications_websocket_urlpatterns = [
    re_path(f'ws/notifications/(?P<user_id>\w+)', NotificationsWSConsumer.as_asgi()),
]