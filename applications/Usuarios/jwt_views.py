from rest_framework_simplejwt.views import TokenObtainPairView
from .jwt_serializer import MyTokenObtainPairSerializer

class MyTokenObtainPerView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def post(self,  *args, **kwargs):
        return super().post(*args, **kwargs)