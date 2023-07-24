from rest_framework_simplejwt.views import TokenObtainPairView
from .jwt_serializer import MyTokenObtainPairSerializer
from .models import Usuarios


class MyTokenObtainPerView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def post(self,  *args, **kwargs):
        logged_user = Usuarios.objects.get(username=args[0].data['username'])
        Usuarios.objects.setUserConection(logged_user, True)
        return super().post(*args, **kwargs)