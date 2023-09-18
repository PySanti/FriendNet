
from django.urls import (
    path
)
from .views import (
    NotificationDeleteAPI
    )

urlpatterns = [
    path('notification/delete/', NotificationDeleteAPI.as_view())
] 