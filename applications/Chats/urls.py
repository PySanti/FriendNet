from django.urls import (
    path
)
from .views import (
    GetChatBetweenAPI,
    SendMsgAPI
)

urlpatterns = [
    path('get_chat_between/', GetChatBetweenAPI.as_view()),
    path('send_msg/', SendMsgAPI.as_view()),
] 