from django.urls import (
    path
)
from .views import (
    CreateUsuariosAPI,
    CheckExistingUserAPI,
    ActivateUserAPI,
    GetUserDetailAPI,
    UpdateUserDataAPI,
    ChangeUserPwdAPI,
    GetUsersListAPI,
    GetChatBetweenAPI,
    SendMsgAPI
    )

urlpatterns = [
    path('create/', CreateUsuariosAPI.as_view()),
    path('create/check_existing_user/', CheckExistingUserAPI.as_view()),
    path('create/activateUser/', ActivateUserAPI.as_view()),
    path('get_user_detail/', GetUserDetailAPI.as_view()),
    path('update_user_data/<int:pk>', UpdateUserDataAPI.as_view()),
    path('change_user_pwd/', ChangeUserPwdAPI.as_view()),
    path('get_user_list/', GetUsersListAPI.as_view()),
    path('get_chat_between/', GetChatBetweenAPI.as_view()),
    path('send_msg/', SendMsgAPI.as_view()),

] 