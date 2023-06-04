from django.urls import path
from .views import HomeView
app_name = 'home'
urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('<int:chat_user_id>', HomeView.as_view(), name='home'),
]