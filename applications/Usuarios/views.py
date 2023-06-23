from rest_framework.generics import (
    CreateAPIView
)

from .serializers import CreateUsuariosSerializer
from .models import Usuarios

class CreateUsuariosAPI(CreateAPIView):
    queryset = Usuarios.objects.all()
    serializer_class = CreateUsuariosSerializer
    def post(self, request, *args, **kwargs):
        print('Almacenando usuario')
        print(request.data)
        return super().post(request, *args, **kwargs)