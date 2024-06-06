import redis
def get_redis_groups():
    r = redis.Redis(host='localhost', port=6379, db=0)
    groups = {}
    for k in r.keys():
        group_name = k.decode("utf-8").split(":")[-1]       
        groups[group_name] = [c.decode("utf-8") for c in r.zrange(k, 0 , -1)]
    return groups