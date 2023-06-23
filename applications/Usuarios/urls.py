from django.urls import (
    path
)
from .views import (
    CreateUsuariosAPI
    )

urlpatterns = [
    path('api/create', CreateUsuariosAPI.as_view()),
] 