import redis
import logging

redis_connection = redis.Redis(host='localhost', port=6379, db=0)
logger_channels = logging.getLogger('django.channels')

def get_redis_groups(key):
    groups = {
        "notifications" : {},
        "chats" : {}
    }
    for k in redis_connection.keys():
        try:
            group_name = k.decode("utf-8").split(":")[-1]       
            group_value = [v.decode("utf-8") for v in redis_connection.zrange(k, 0 , -1)]
            groups["chats" if "-" in group_name else "notifications"][group_name] = group_value
        except UnicodeDecodeError:
            logger_channels.info("Error tratando de decodificar, se omitirá")
    return groups[key]