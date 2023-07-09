from django.urls import (
    path
)
from .views import (
    GetUserNotificationsAPI,
    RemoveNotificationAPI
)
urlpatterns = [
    path('get_user_notifications/<int:pk>', GetUserNotificationsAPI.as_view()),
    path('remove_notification/<int:pk>', RemoveNotificationAPI.as_view()),
]