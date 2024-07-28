from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework import status
from .models import RateLimitInfo
import logging
from .utils.valid_ip import valid_ip

logger = logging.getLogger('ratelimit_logger')


class RateLimitMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # recordar agregar docs a miro
        client_ip = request.headers.get('public')
        if client_ip and valid_ip(client_ip):
            logger.warning(f"Endpoint : {request.path}, Client Ip : {client_ip}, Valid !")
            client = RateLimitInfo.objects.get_or_create(ip=client_ip)[0]
            if client.banned:
                logger.warning(f"{client.id} ---- banned")
                return JsonResponse({"error" : "banned_ip_fucK_u"}, status=status.HTTP_403_FORBIDDEN)
            elif RateLimitInfo.objects.client_is_suspended(client):
                logger.warning(f"{client.id} ---- suspended")
                return JsonResponse({"error" : f"suspended_ip", "until" : client.suspended_time}, status=status.HTTP_403_FORBIDDEN)
            else:
                if (RateLimitInfo.objects.get_cut_timediff(client) > 5):
                    RateLimitInfo.objects.update_cut(client)
                else:
                    RateLimitInfo.objects.update_calls_in_cut(client)
                    if client.calls_in_cut > 30:
                        RateLimitInfo.objects.suspend_client(client)
        else:
            logger.warning(f"Endpoint : {request.path}, Client Ip : {client_ip}, !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   DENIED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            return JsonResponse({"error" : "suspicious_ip"}, status=status.HTTP_403_FORBIDDEN)