from django.urls import (
    path
)
from .views import (
    CreateUsuariosAPI,
    CheckExistingUserAPI,
    ActivateUserAPI,
    GetUserDetailAPI
    )

urlpatterns = [
    path('create/', CreateUsuariosAPI.as_view()),
    path('create/check_existing_user/', CheckExistingUserAPI.as_view()),
    path('create/activateUser/', ActivateUserAPI.as_view()),
    path('get_user_detail/', GetUserDetailAPI.as_view()),
] 