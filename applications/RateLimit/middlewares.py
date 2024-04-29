from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework import status
from .models import RateLimitInfo

class RateLimitMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # recordar agregar docs a miro
        client_ip = request.META.get('REMOTE_ADDR')
        client = RateLimitInfo.objects.get_or_create(ip=client_ip)[0]
        if client.banned:
            return JsonResponse({"error" : "banned_ip_fucK_u"}, status=status.HTTP_403_FORBIDDEN)
        elif RateLimitInfo.objects.client_is_suspended(client):
            return JsonResponse({"error" : f"suspended_ip", "until" : client.suspended_time}, status=status.HTTP_403_FORBIDDEN)
        else:
            if (RateLimitInfo.objects.get_cut_timediff(client) > 5):
                RateLimitInfo.objects.update_cut(client)
            else:
                RateLimitInfo.objects.update_calls_in_cut(client)
                if client.calls_in_cut > 30:
                    RateLimitInfo.objects.suspend_client(client)