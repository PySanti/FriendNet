from django.core.cache import cache

def manage_groups(mode, branch, val=None):
    groups = cache.get(branch) if cache.get(branch) else {}
    if (mode  == "get"):
        return groups
    elif (mode in ["append", "discard"]):
        group_name = val["group_name"]
        channel = val["channel_name"]
        if (mode == "append"):
            if group_name in groups:
                groups[group_name].append(channel)
            else:
                groups[group_name] = [channel]
        elif (mode == "discard"):
            if (group_name in groups):
                if (channel in groups[group_name]):
                    groups[group_name].remove(channel)
                if len(groups[group_name]) == 0:
                    groups.pop(group_name)
        cache.set(branch, groups)
        return groups
