from django.urls import (
    path
)
from .views import (
    CreateUsuariosAPI,
    CheckExistingUserAPI,
    ActivateUserAPI

    )

urlpatterns = [
    path('create/', CreateUsuariosAPI.as_view()),
    path('create/check_existing_user/<str:username>/<str:email>', CheckExistingUserAPI.as_view()),
    path('create/activateUser/', ActivateUserAPI.as_view()),
] 