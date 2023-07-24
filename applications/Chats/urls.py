from django.urls import (
    path
)
from .views import (
    GetMessagesHistorialAPI,
    SendMsgAPI
)

urlpatterns = [
    path('get_messages_historial/', GetMessagesHistorialAPI.as_view()),
    path('send_msg/', SendMsgAPI.as_view()),
] 