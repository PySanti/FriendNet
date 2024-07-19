import logging

logger = logging.getLogger('ratelimit_logger')

def get_client_ip(request):
    # x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    # if x_forwarded_for:
    #     logger.warning(f"Multiple ips : {x_forwarded_for}")
    #     ip = x_forwarded_for.split(',')[0]
    # else:
    #     ip = request.META.get('REMOTE_ADDR')
    # return ip
    return request.META.get('REMOTE_ADDR')