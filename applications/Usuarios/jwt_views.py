from rest_framework_simplejwt.views import TokenObtainPairView
from .jwt_serializer import MyTokenObtainPairSerializer

class MyTokenObtainPerView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer