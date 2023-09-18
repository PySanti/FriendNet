
from django.urls import (
    path
)
from .views import (
    NotificationDeleteAPI
    )

urlpatterns = [
    path('notifications/delete', NotificationDeleteAPI.as_view())
] 