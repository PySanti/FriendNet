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
        if client.banned:
            return JsonResponse({"error" : "banned_ip"}, status=status.HTTP_400_BAD_REQUEST)
        elif client.suspended:
            return JsonResponse({"error" : f"suspended ip until"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            last_cut_timediff = RateLimitInfo.objects.get_cut_timediff(client)
            if (last_cut_timediff > 5):
                RateLimitInfo.objects.update_cut_time(client)
            else:
                print(last_cut_timediff)
        return JsonResponse({"error" : False}, status=status.HTTP_429_TOO_MANY_REQUESTS)
