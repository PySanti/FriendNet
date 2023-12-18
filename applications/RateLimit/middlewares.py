from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework import status
from .models import RateLimitInfo
from datetime import datetime
import pytz

class RateLimitMiddleware(MiddlewareMixin):
    def process_request(self, request):
        client_ip = request.META.get('REMOTE_ADDR')
        client = RateLimitInfo.objects.get_or_create(ip=client_ip)[0]
        last_cut_timediff = int((datetime.now(pytz.timezone('UTC')) - client.last_cut_time).seconds)
        if (last_cut_timediff > 5):
            client.last_cut_time = datetime.now()
            client.save()
        else:
            pass
        return JsonResponse({"error" : False}, status=status.HTTP_429_TOO_MANY_REQUESTS)
