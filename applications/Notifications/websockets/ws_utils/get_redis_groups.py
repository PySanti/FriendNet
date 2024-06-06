import redis
def get_redis_groups(key):
    r = redis.Redis(host='localhost', port=6379, db=0)
    groups = {
        "notifications" : {},
        "chats" : {}
    }
    for k in r.keys():
        group_name = k.decode("utf-8").split(":")[-1]       
        group_value = [c.decode("utf-8") for c in r.zrange(k, 0 , -1)]
        groups["chats" if "-" in group_name else "notifications"][group_name] = group_value
    return groups[key]