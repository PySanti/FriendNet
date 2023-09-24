from rest_framework.views import APIView
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
from rest_framework import response
from .models import Notifications
from rest_framework import status
class NotificationDeleteAPI(APIView):
    serializer_class = NotificationsDeleteSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                Notifications.objects.deleteNotification(request.data['notification_id'])
            except:
                return response.Response({'deleted' : False}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return response.Response({'deleted' : True}, status=status.HTTP_200_OK)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE 