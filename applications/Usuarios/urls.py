from django.urls import (
    path
)
from .views import (
    LoginView, 
    LogoutView, 
    SignUpView,
    ShowUserDetailView,
    AccountActivationView
    )

app_name = 'users'

urlpatterns = [
    path('signin/', LoginView.as_view(), name='signin'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signout/<int:pk>', LogoutView.as_view(), name='signout'),
    path('activation/<int:pk>', AccountActivationView.as_view(), name='activation'),
    path('detail/<int:pk>', ShowUserDetailView.as_view(),name='detail')
] 