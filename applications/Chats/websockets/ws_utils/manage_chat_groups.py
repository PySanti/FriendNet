from django.core.cache import cache
def manage_chat_groups(mode, val=None):
    groups = cache.get("chats") if cache.get("chats") else {}
    if (mode  == "get"):
        return groups
    elif (mode in ["append", "discard"]):
        if (mode == "append"):
            if ((val["group_name"] in groups) ):
                groups[val["group_name"]].append(val["channel_name"])
            else:
                groups[val["group_name"]] = [val["channel_name"]]
        elif (mode == "discard"):
            if (val["channel_name"] in groups[val["group_name"]]):
                groups[val["group_name"]].remove(val["channel_name"])
            if (len(groups[val["group_name"]]) == 0):
                groups.pop(val["group_name"])
        cache.set("chats", groups)
        return groups
