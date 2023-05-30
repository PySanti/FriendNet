from django.urls import (
    path
)
from .views import LoginView, LogoutView, SignUpView

app_name = 'users'

urlpatterns = [
    path('signin/', LoginView.as_view(), name='signin'),
    path('signout/', LogoutView.as_view(), name='signout'),
    path('signup/', SignUpView.as_view(), name='signup'),
] 