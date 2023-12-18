from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework import status
from .models import RateLimitInfo

class RateLimitMiddleware(MiddlewareMixin):
    def process_request(self, request):
        client_ip = request.META.get('REMOTE_ADDR')
        client = RateLimitInfo.objects.get_or_create(ip=client_ip)[0]
        print(client.last_cut_time)
        return JsonResponse({"error" : False}, status=status.HTTP_429_TOO_MANY_REQUESTS)
