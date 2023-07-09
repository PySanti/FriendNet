from django.http import JsonResponse
from rest_framework import status
from .serializers import (
    RemoveNotificationSerializer,
)
from rest_framework.views import (
    APIView,
)
from rest_framework.response import Response
from .models import Notifications
from rest_framework.generics import (
    DestroyAPIView
)
from applications.Usuarios.models import Usuarios
# Create your views here.

class GetUserNotificationsAPI(APIView):
    def get(self, request, *args, **kwargs):
        try:
            user_notifications = Usuarios.objects.get(id=kwargs['pk']).notifications
            return JsonResponse({"notifications" : list(user_notifications.values())})
        except:
            return Response({"error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RemoveNotificationAPI(DestroyAPIView):
    serializer_class = RemoveNotificationSerializer
    queryset = Notifications.objects.all()
