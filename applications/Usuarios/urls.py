from django.urls import (
    path
)
from .views import (
    CreateUsuariosAPI,
    CheckExistingUser
    )

urlpatterns = [
    path('api/create', CreateUsuariosAPI.as_view()),
    path('api/create/check_existing_user/<str:username>/<str:email>', CheckExistingUser.as_view()),
] 