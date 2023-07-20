from django.urls import (
    path
)
from .views import (
    GetUserNotificationsAPI,
)
urlpatterns = [
    path('get_user_notifications/<int:pk>', GetUserNotificationsAPI.as_view()),
]