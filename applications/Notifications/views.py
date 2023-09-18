from rest_framework.generics import APIView
from .serializers import NotificationsDeleteSerializer
from rest_framework_simplejwt.authentication import (
    JWTAuthentication
)
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny
)
from applications.Usuarios.utils.constants import (
    BASE_SERIALIZER_ERROR_RESPONSE
)
class NotificationDeleteAPI(APIView):
    serializer_class = NotificationsDeleteSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(request.data)
        if serialized_data.is_valid():
            pass
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE 