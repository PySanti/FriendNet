from django.core.cache import cache
def manage_notifications_groups(mode,  val=None):
    groups = cache.get("notifications") if cache.get("notifications") else {}
    if (mode == 'get'):
        return groups
    
    elif (mode in ["append", "delete"]):
        if (mode == "append"):
            if (val["user_id"] in groups):
                groups[val["user_id"]].append(val["channel_name"])
            else:
                groups[val["user_id"]] = [val["channel_name"]]
        elif (mode == "delete"):
            groups[val["user_id"]].remove(val["channel_name"])
            if (len(groups[val["user_id"]]) == 0):
                groups.pop(val["user_id"])
        cache.set("notifications", groups)
        return groups


