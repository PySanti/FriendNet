from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse

class RateLimitMiddleware(MiddlewareMixin):
    def process_request(self, request):
        pass
