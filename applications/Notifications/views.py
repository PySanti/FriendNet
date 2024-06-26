from rest_framework.views import APIView
from .serializers import NotificationsDeleteSerializer
from rest_framework_simplejwt.authentication import (
    JWTAuthentication
)
from rest_framework.permissions import (
    IsAuthenticated,
)
from applications.Usuarios.utils.constants import (
    BASE_SERIALIZER_ERROR_RESPONSE,
    BASE_ERROR_WHILE_DELETING_NOTIFICATION_RESPONSE,
)
from .models import Notifications
from rest_framework import status
from rest_framework.response import Response

class NotificationDeleteAPI(APIView):
    serializer_class = NotificationsDeleteSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                Notifications.objects.delete_notification(request.data['notification_id'])
            except:
                return BASE_ERROR_WHILE_DELETING_NOTIFICATION_RESPONSE
            else:
                return Response({'deleted' : True}, status=status.HTTP_200_OK)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE 