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
    BASE_SERIALIZER_ERROR_RESPONSE,
    BASE_ERROR_WHILE_DELETING_NOTIFICATION_RESPONSE,
    BASE_RATE_LIMIT_TIMER,
    BASE_RATE_LIMIT_KEY
)
from .models import Notifications
from rest_framework import status
from rest_framework.response import Response
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

class NotificationDeleteAPI(APIView):
    serializer_class = NotificationsDeleteSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    @method_decorator(ratelimit(key=BASE_RATE_LIMIT_KEY, rate=BASE_RATE_LIMIT_TIMER, method="POST"))
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                Notifications.objects.deleteNotification(request.data['notification_id'])
            except:
                return BASE_ERROR_WHILE_DELETING_NOTIFICATION_RESPONSE
            else:
                return Response({'deleted' : True}, status=status.HTTP_200_OK)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE 