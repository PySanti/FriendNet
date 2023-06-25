from django.urls import (
    path
)
from .views import (
    CreateUsuariosAPI,
    CheckExistingUserAPI,
    ActivateUserAPI

    )

urlpatterns = [
    path('api/create', CreateUsuariosAPI.as_view()),
    path('api/create/check_existing_user/<str:username>/<str:email>', CheckExistingUserAPI.as_view()),
    path('api/create/activateUser/', ActivateUserAPI.as_view()),
] 