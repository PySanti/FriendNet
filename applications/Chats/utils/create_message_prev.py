def create_message_prev(msg):
    return  msg if len(msg) <= 15 else f"{msg[:15]} ..."

