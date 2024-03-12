[1mdiff --git a/FriendNet/__pycache__/asgi.cpython-38.pyc b/FriendNet/__pycache__/asgi.cpython-38.pyc[m
[1mindex f319d2b..9e48539 100644[m
Binary files a/FriendNet/__pycache__/asgi.cpython-38.pyc and b/FriendNet/__pycache__/asgi.cpython-38.pyc differ
[1mdiff --git a/FriendNet/__pycache__/settings.cpython-38.pyc b/FriendNet/__pycache__/settings.cpython-38.pyc[m
[1mindex d33c42e..361e2b2 100644[m
Binary files a/FriendNet/__pycache__/settings.cpython-38.pyc and b/FriendNet/__pycache__/settings.cpython-38.pyc differ
[1mdiff --git a/FriendNet/asgi.py b/FriendNet/asgi.py[m
[1mindex ee2ae64..716d9ed 100644[m
[1m--- a/FriendNet/asgi.py[m
[1m+++ b/FriendNet/asgi.py[m
[36m@@ -1,14 +1,14 @@[m
 # mysite/asgi.py[m
 import os[m
[31m-from channels.auth import AuthMiddlewareStack[m
 from channels.routing import ProtocolTypeRouter, URLRouter[m
 from channels.security.websocket import AllowedHostsOriginValidator[m
 from django.core.asgi import get_asgi_application[m
[31m-from applications.Chats.websockets.routing import chat_websocket_urlpatterns[m
[31m-from applications.Notifications.websockets.routing import notifications_websocket_urlpatterns[m
 import os[m
 import django[m
[31m-from channels.routing import get_default_application[m
[32m+[m[32mfrom applications.Notifications.websockets.consumers import NotificationsWSConsumer[m
[32m+[m[32mfrom django.urls import re_path[m
[32m+[m
[32m+[m
 [m
 os.environ.setdefault("DJANGO_SETTINGS_MODULE", f'FriendNet.settings')[m
 django.setup()[m
[36m@@ -21,8 +21,7 @@[m [mapplication = ProtocolTypeRouter([m
         "http": get_asgi_application(),[m
         "websocket": AllowedHostsOriginValidator([m
                 URLRouter([m
[31m-                    chat_websocket_urlpatterns  +   [m
[31m-                    notifications_websocket_urlpatterns[m
[32m+[m[32m                    [re_path(f'ws/notifications/(?P<user_id>\w+)', NotificationsWSConsumer.as_asgi())][m
                 )[m
         ),[m
     }[m
[1mdiff --git a/applications/Chats/__pycache__/views.cpython-38.pyc b/applications/Chats/__pycache__/views.cpython-38.pyc[m
[1mindex 291bf72..9bab432 100644[m
Binary files a/applications/Chats/__pycache__/views.cpython-38.pyc and b/applications/Chats/__pycache__/views.cpython-38.pyc differ
[1mdiff --git a/applications/Chats/views.py b/applications/Chats/views.py[m
[1mindex 1953f17..e413776 100644[m
[1m--- a/applications/Chats/views.py[m
[1m+++ b/applications/Chats/views.py[m
[36m@@ -31,9 +31,9 @@[m [mfrom applications.Usuarios.models import Usuarios[m
 from applications.Notifications.models import Notifications[m
 # Create your views here.[m
 from applications.Notifications.websockets.ws_utils.notification_websocket_is_opened import notification_websocket_is_opened[m
[31m-from .websockets.ws_utils.messages_group_is_full import messages_group_is_full[m
 from applications.Notifications.websockets.ws_utils.broadcast_notification import broadcast_notification[m
[31m-from applications.Chats.websockets.ws_utils.broadcast_message import broadcast_message[m
[32m+[m[32mfrom applications.Notifications.websockets.ws_utils.messages_group_is_full import messages_group_is_full[m
[32m+[m[32mfrom applications.Notifications.websockets.ws_utils.broadcast_message import broadcast_message[m
 from applications.Usuarios.utils.add_istyping_field import add_istyping_field[m
 class GetMessagesHistorialAPI(APIView):[m
     serializer_class        =  GetMessagesHistorialSerializer[m
[1mdiff --git a/applications/Chats/websockets/__pycache__/consumers.cpython-38.pyc b/applications/Chats/websockets/__pycache__/consumers.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 3fce80e..0000000[m
Binary files a/applications/Chats/websockets/__pycache__/consumers.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/__pycache__/routing.cpython-38.pyc b/applications/Chats/websockets/__pycache__/routing.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 016351d..0000000[m
Binary files a/applications/Chats/websockets/__pycache__/routing.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/__pycache__/wsauthenticator.cpython-38.pyc b/applications/Chats/websockets/__pycache__/wsauthenticator.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 518ed4f..0000000[m
Binary files a/applications/Chats/websockets/__pycache__/wsauthenticator.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/consumers.py b/applications/Chats/websockets/consumers.py[m
[1mdeleted file mode 100644[m
[1mindex d04c3ec..0000000[m
[1m--- a/applications/Chats/websockets/consumers.py[m
[1m+++ /dev/null[m
[36m@@ -1,57 +0,0 @@[m
[31m-from channels.generic.websocket import WebsocketConsumer[m
[31m-from asgiref.sync import async_to_sync[m
[31m-from .ws_utils.print_pretty_groups import print_pretty_groups[m
[31m-import json[m
[31m-from .ws_utils.broadcast_dict import broadcast_dict[m
[31m-from .ws_utils.messages_group_name import messages_group_name[m
[31m-from .ws_utils.manage_chat_groups import manage_chat_groups[m
[31m-import logging[m
[31m-[m
[31m-logger = logging.getLogger('django.channels')[m
[31m-[m
[31m-class ChatWSConsumer(WebsocketConsumer):[m
[31m-    def connect(self):[m
[31m-        self.accept()[m
[31m-        print(f'Generando conexion a channel -> {self.channel_name}')[m
[31m-    [m
[31m-    def _discard_channel_from_groups(self):[m
[31m-        async_to_sync(self.channel_layer.group_discard)(self.scope["group_name"], self.channel_name)[m
[31m-        manage_chat_groups("discard", {"group_name" : self.scope["group_name"] , "channel_name" : self.channel_name})[m
[31m-        self.scope["group_name"] = None[m
[31m-[m
[31m-    def disconnect(self, close_code):[m
[31m-        if ("group_name" in self.scope and self.scope["group_name"]):[m
[31m-            logger.info(f"Desconectando websocket de chat, {self.scope['group_name']}:{self.channel_name}")[m
[31m-            self._discard_channel_from_groups()[m
[31m-        print_pretty_groups()[m
[31m-[m
[31m-    def receive(self, text_data):[m
[31m-        data = json.loads(text_data)[m
[31m-        if data['type'] == "group_creation":[m
[31m-            if (("group_name" in self.scope) and self.scope["group_name"]):[m
[31m-                self._discard_channel_from_groups()[m
[31m-            self.scope["group_name"] = messages_group_name(data['value']['session_user_id'], data['value']['clicked_user_id'])[m
[31m-[m
[31m-            groups = manage_chat_groups("get")[m
[31m-            group_name = self.scope["group_name"][m
[31m-            if (((group_name in groups) and (self.channel_name not in groups[group_name])) or (group_name not in groups)):[m
[31m-                logger.info(f"Agregando websocket de chat, {self.scope['group_name']}:{self.channel_name}")[m
[31m-                async_to_sync(self.channel_layer.group_add)(self.scope["group_name"],self.channel_name)[m
[31m-                manage_chat_groups("append", {"group_name" : self.scope["group_name"] , "channel_name" : self.channel_name})[m
[31m-[m
[31m-        if data['type'] == "group_delete":[m
[31m-            self._discard_channel_from_groups()[m
[31m-        print_pretty_groups()[m
[31m-[m
[31m-[m
[31m-    def broadcast_message_handler(self, event):[m
[31m-        """[m
[31m-            Método a ejecutar para transmitir un mensaje en un grupo[m
[31m-        """[m
[31m-        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="message_broadcast", broadcast_value=event["value"])))[m
[31m-    def broadcast_connection_inform_handler(self, event):[m
[31m-        """[m
[31m-            Método a ejecutar para informar a integrante del grupo que el otro se conecto[m
[31m-        """[m
[31m-        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="connection_inform", broadcast_value=event["value"])))[m
[31m-[m
[1mdiff --git a/applications/Chats/websockets/routing.py b/applications/Chats/websockets/routing.py[m
[1mdeleted file mode 100644[m
[1mindex 3b74719..0000000[m
[1m--- a/applications/Chats/websockets/routing.py[m
[1m+++ /dev/null[m
[36m@@ -1,8 +0,0 @@[m
[31m-from .consumers import ChatWSConsumer[m
[31m-from django.urls import ([m
[31m-    path[m
[31m-)[m
[31m-[m
[31m-chat_websocket_urlpatterns = [[m
[31m-    path('ws/chat/', ChatWSConsumer.as_asgi()),[m
[31m-][m
\ No newline at end of file[m
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/bye_to_last_group.cpython-38.pyc b/applications/Chats/websockets/ws_utils/__pycache__/bye_to_last_group.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 8044245..0000000[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/bye_to_last_group.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/channel_in_group.cpython-38.pyc b/applications/Chats/websockets/ws_utils/__pycache__/channel_in_group.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex c6425cd..0000000[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/channel_in_group.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/create_chat_group.cpython-38.pyc b/applications/Chats/websockets/ws_utils/__pycache__/create_chat_group.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 6a8778b..0000000[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/create_chat_group.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/discard_channel_if_found.cpython-38.pyc b/applications/Chats/websockets/ws_utils/__pycache__/discard_channel_if_found.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 6b49b30..0000000[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/discard_channel_if_found.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/discard_channel_if_founded.cpython-38.pyc b/applications/Chats/websockets/ws_utils/__pycache__/discard_channel_if_founded.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 9ae23fe..0000000[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/discard_channel_if_founded.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/group_info_dict.cpython-38.pyc b/applications/Chats/websockets/ws_utils/__pycache__/group_info_dict.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 5f2cf91..0000000[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/group_info_dict.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/manage_chat_groups.cpython-38.pyc b/applications/Chats/websockets/ws_utils/__pycache__/manage_chat_groups.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex d40b27e..0000000[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/manage_chat_groups.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/messages_group_is_full.cpython-38.pyc b/applications/Chats/websockets/ws_utils/__pycache__/messages_group_is_full.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 7885a8c..0000000[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/messages_group_is_full.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/notification_wesocket_is_opened.cpython-38.pyc b/applications/Chats/websockets/ws_utils/__pycache__/notification_wesocket_is_opened.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 6ed70fe..0000000[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/notification_wesocket_is_opened.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/print_pretty_groups.cpython-38.pyc b/applications/Chats/websockets/ws_utils/__pycache__/print_pretty_groups.cpython-38.pyc[m
[1mdeleted file mode 100644[m
[1mindex 37f6d34..0000000[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/print_pretty_groups.cpython-38.pyc and /dev/null differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/manage_chat_groups.py b/applications/Chats/websockets/ws_utils/manage_chat_groups.py[m
[1mdeleted file mode 100644[m
[1mindex f7f07c8..0000000[m
[1m--- a/applications/Chats/websockets/ws_utils/manage_chat_groups.py[m
[1m+++ /dev/null[m
[36m@@ -1,18 +0,0 @@[m
[31m-from django.core.cache import cache[m
[31m-def manage_chat_groups(mode, val=None):[m
[31m-    groups = cache.get("chats") if cache.get("chats") else {}[m
[31m-    if (mode  == "get"):[m
[31m-        return groups[m
[31m-    elif (mode in ["append", "discard"]):[m
[31m-        if (mode == "append"):[m
[31m-            if ((val["group_name"] in groups) ):[m
[31m-                groups[val["group_name"]].append(val["channel_name"])[m
[31m-            else:[m
[31m-                groups[val["group_name"]] = [val["channel_name"]][m
[31m-        elif (mode == "discard"):[m
[31m-            if (val["channel_name"] in groups[val["group_name"]]):[m
[31m-                groups[val["group_name"]].remove(val["channel_name"])[m
[31m-            if (len(groups[val["group_name"]]) == 0):[m
[31m-                groups.pop(val["group_name"])[m
[31m-        cache.set("chats", groups)[m
[31m-        return groups[m
[1mdiff --git a/applications/Chats/websockets/ws_utils/print_pretty_groups.py b/applications/Chats/websockets/ws_utils/print_pretty_groups.py[m
[1mdeleted file mode 100644[m
[1mindex 40b99b7..0000000[m
[1m--- a/applications/Chats/websockets/ws_utils/print_pretty_groups.py[m
[1m+++ /dev/null[m
[36m@@ -1,14 +0,0 @@[m
[31m-from django.core.cache import cache[m
[31m-import logging[m
[31m-[m
[31m-def print_pretty_groups():[m
[31m-    """[m
[31m-        Imprimira los grupos actuales almacenados en el channel layer[m
[31m-    """[m
[31m-    logger = logging.getLogger('django.channels')[m
[31m-    logger.info(" ------------------------------------------------ ")[m
[31m-    modes = ["notifications", "chats"][m
[31m-    for m in modes:[m
[31m-        if (cache.get(m)):[m
[31m-            for k,v in cache.get(m).items():[m
[31m-                logger.info(f'{k} -> {v}')[m
\ No newline at end of file[m
[1mdiff --git a/applications/Notifications/websockets/__pycache__/consumers.cpython-38.pyc b/applications/Notifications/websockets/__pycache__/consumers.cpython-38.pyc[m
[1mindex 08c2d47..1b4e67f 100644[m
Binary files a/applications/Notifications/websockets/__pycache__/consumers.cpython-38.pyc and b/applications/Notifications/websockets/__pycache__/consumers.cpython-38.pyc differ
[1mdiff --git a/applications/Notifications/websockets/consumers.py b/applications/Notifications/websockets/consumers.py[m
[1mindex e4009f9..c65b2b8 100644[m
[1m--- a/applications/Notifications/websockets/consumers.py[m
[1m+++ b/applications/Notifications/websockets/consumers.py[m
[36m@@ -2,28 +2,39 @@[m [mimport time[m
 from channels.generic.websocket import WebsocketConsumer[m
 import logging[m
 from asgiref.sync import async_to_sync[m
[31m-from applications.Chats.websockets.ws_utils.print_pretty_groups import print_pretty_groups[m
 import json[m
 from .ws_utils.broadcast_connection_inform import broadcast_connection_inform[m
[31m-from applications.Chats.websockets.ws_utils.broadcast_dict import broadcast_dict[m
 from .ws_utils.broadcast_typing_inform import broadcast_typing_inform[m
 from .ws_utils.notification_websocket_is_opened import notification_websocket_is_opened[m
 from applications.Usuarios.utils.handle_initial_notification_ids import handle_initial_notification_ids[m
[31m-from .ws_utils.manage_notifications_groups import manage_notifications_groups[m
[32m+[m[32mfrom .ws_utils.print_pretty_groups import print_pretty_groups[m
[32m+[m[32mfrom .ws_utils.broadcast_dict import broadcast_dict[m
[32m+[m[32mfrom .ws_utils.messages_group_name import messages_group_name[m
[32m+[m[32mfrom .ws_utils.manage_groups import manage_groups[m
[32m+[m[32mfrom applications.Usuarios.utils.constants import ([m
[32m+[m[32m    BASE_CHATS_WEBSOCKETS_GROUP_NAME,[m
[32m+[m[32m    BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME[m
[32m+[m[32m)[m
 [m
 [m
 logger = logging.getLogger('django.channels')[m
 [m
 class NotificationsWSConsumer(WebsocketConsumer):[m
[32m+[m[32m    def _discard_channel_from_groups(self):[m
[32m+[m[32m        logger.info(f"Eliminando websocket de chat, {self.scope['group_name']}:{self.channel_name}")[m
[32m+[m[32m        async_to_sync(self.channel_layer.group_discard)(self.scope["group_name"], self.channel_name)[m
[32m+[m[32m        manage_groups("discard", BASE_CHATS_WEBSOCKETS_GROUP_NAME, {"group_name" : self.scope["group_name"] , "channel_name" : self.channel_name})[m
[32m+[m[32m        self.scope["group_name"] = None[m
[32m+[m
[32m+[m
     def connect(self):[m
         self.accept()[m
         user_id = str(self.scope['url_route']['kwargs']['user_id'])[m
[31m-        groups = manage_notifications_groups("get")[m
[32m+[m[32m        groups = manage_groups("get", BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME)[m
         logger.info(f'-> Conectando websocket de notificacion, {user_id}')[m
[31m-[m
         if ((user_id not in groups) or ((user_id in groups) and (self.channel_name not in groups[user_id]))):[m
             async_to_sync(self.channel_layer.group_add)(user_id,self.channel_name)[m
[31m-            groups = manage_notifications_groups('append', {"user_id" : user_id, "channel_name" : self.channel_name})[m
[32m+[m[32m            groups = manage_groups('append', BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME, {"group_name" : user_id, "channel_name" : self.channel_name})[m
 [m
             if len(groups[user_id])>1:[m
                 async_to_sync(self.channel_layer.group_send)(user_id,{"type" : "broadcast_connection_error_handler"})[m
[36m@@ -32,24 +43,53 @@[m [mclass NotificationsWSConsumer(WebsocketConsumer):[m
             print_pretty_groups()[m
 [m
     def disconnect(self, close_code):[m
[32m+[m
[32m+[m[32m        # not[m
         user_id = str(self.scope['url_route']['kwargs']['user_id'])[m
         logger.info(f'-> Desconectando websocket de notificacion, {user_id}')[m
 [m
         [m
[31m-        if (user_id in manage_notifications_groups("get")):[m
[32m+[m[32m        if (user_id in manage_groups("get", BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME)):[m
             async_to_sync(self.channel_layer.group_discard)(user_id, self.channel_name)[m
             handle_initial_notification_ids('delete', user_id )[m
[31m-            manage_notifications_groups('delete', {"user_id" : user_id, "channel_name" : self.channel_name})[m
[32m+[m[32m            manage_groups('discard', BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME, {"group_name" : user_id, "channel_name" : self.channel_name})[m
             broadcast_connection_inform(user_id=user_id, connected=False)[m
 [m
[31m-            print_pretty_groups()[m
[32m+[m[32m        # chat[m
[32m+[m[32m        if ("group_name" in self.scope and self.scope["group_name"]):[m
[32m+[m[32m            self._discard_channel_from_groups()[m
[32m+[m
[32m+[m[32m        print_pretty_groups()[m
[32m+[m
[32m+[m
 [m
     def receive(self, text_data):[m
         data = json.loads(text_data)[m
[32m+[m[32m        user_id = int(self.scope['url_route']['kwargs']['user_id'])[m
[32m+[m
[32m+[m[32m        # not[m
         if (data["type"] == "typing_inform"):[m
             value = data["value"][m
             if notification_websocket_is_opened(value["clicked_user_id"]):[m
[31m-                broadcast_typing_inform(**value)[m
[32m+[m[32m                broadcast_typing_inform(user_id, **value)[m
[32m+[m
[32m+[m
[32m+[m[32m        # chat[m
[32m+[m[32m        if data['type'] == "group_creation":[m
[32m+[m[32m            if (("group_name" in self.scope) and self.scope["group_name"]):[m
[32m+[m[32m                self._discard_channel_from_groups()[m
[32m+[m[32m            self.scope["group_name"] = messages_group_name(user_id, data['value']['clicked_user_id'])[m
[32m+[m
[32m+[m[32m            groups = manage_groups("get", BASE_CHATS_WEBSOCKETS_GROUP_NAME)[m
[32m+[m[32m            group_name = self.scope["group_name"][m
[32m+[m[32m            if (((group_name in groups) and (self.channel_name not in groups[group_name])) or (group_name not in groups)):[m
[32m+[m[32m                logger.info(f"Agregando websocket de chat, {self.scope['group_name']}:{self.channel_name}")[m
[32m+[m[32m                async_to_sync(self.channel_layer.group_add)(self.scope["group_name"],self.channel_name)[m
[32m+[m[32m                manage_groups("append", BASE_CHATS_WEBSOCKETS_GROUP_NAME, {"group_name" : self.scope["group_name"] , "channel_name" : self.channel_name})[m
[32m+[m
[32m+[m[32m        if data['type'] == "group_delete":[m
[32m+[m[32m            self._discard_channel_from_groups()[m
[32m+[m[32m        print_pretty_groups()[m
 [m
 [m
     def broadcast_typing_inform_handler(self, event):[m
[36m@@ -60,4 +100,11 @@[m [mclass NotificationsWSConsumer(WebsocketConsumer):[m
         self.send(text_data=json.dumps(broadcast_dict(broadcast_type="connection_error")))[m
     def broadcast_updated_user_handler(self, event):[m
         self.send(text_data=json.dumps(broadcast_dict(broadcast_type="updated_user", broadcast_value=event["value"])))[m
[32m+[m[32m    def broadcast_message_handler(self, event):[m
[32m+[m[32m        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="message_broadcast", broadcast_value=event["value"])))[m
[32m+[m[32m    def broadcast_connection_inform_handler(self, event):[m
[32m+[m[32m        self.send(text_data=json.dumps(broadcast_dict(broadcast_type="connection_inform", broadcast_value=event["value"])))[m
[41m+[m
[41m+[m
[41m+[m
 [m
[1mdiff --git a/applications/Notifications/websockets/routing.py b/applications/Notifications/websockets/routing.py[m
[1mdeleted file mode 100644[m
[1mindex a25572b..0000000[m
[1m--- a/applications/Notifications/websockets/routing.py[m
[1m+++ /dev/null[m
[36m@@ -1,9 +0,0 @@[m
[31m-from .consumers import NotificationsWSConsumer[m
[31m-[m
[31m-from django.urls import re_path[m
[31m-[m
[31m-notifications_websocket_urlpatterns = [[m
[31m-    re_path(f'ws/notifications/(?P<user_id>\w+)', NotificationsWSConsumer.as_asgi()),[m
[31m-][m
[31m-[m
[31m-[m
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/broadcast_dict.cpython-38.pyc b/applications/Notifications/websockets/ws_utils/__pycache__/broadcast_dict.cpython-38.pyc[m
[1msimilarity index 63%[m
[1mrename from applications/Chats/websockets/ws_utils/__pycache__/broadcast_dict.cpython-38.pyc[m
[1mrename to applications/Notifications/websockets/ws_utils/__pycache__/broadcast_dict.cpython-38.pyc[m
[1mindex 057fe23..db182a3 100644[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/broadcast_dict.cpython-38.pyc and b/applications/Notifications/websockets/ws_utils/__pycache__/broadcast_dict.cpython-38.pyc differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/broadcast_message.cpython-38.pyc b/applications/Notifications/websockets/ws_utils/__pycache__/broadcast_message.cpython-38.pyc[m
[1msimilarity index 58%[m
[1mrename from applications/Chats/websockets/ws_utils/__pycache__/broadcast_message.cpython-38.pyc[m
[1mrename to applications/Notifications/websockets/ws_utils/__pycache__/broadcast_message.cpython-38.pyc[m
[1mindex 06ca732..8861c10 100644[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/broadcast_message.cpython-38.pyc and b/applications/Notifications/websockets/ws_utils/__pycache__/broadcast_message.cpython-38.pyc differ
[1mdiff --git a/applications/Notifications/websockets/ws_utils/__pycache__/get_opened_chat_groups_with_id.cpython-38.pyc b/applications/Notifications/websockets/ws_utils/__pycache__/get_opened_chat_groups_with_id.cpython-38.pyc[m
[1mindex 5b2a694..768bcd8 100644[m
Binary files a/applications/Notifications/websockets/ws_utils/__pycache__/get_opened_chat_groups_with_id.cpython-38.pyc and b/applications/Notifications/websockets/ws_utils/__pycache__/get_opened_chat_groups_with_id.cpython-38.pyc differ
[1mdiff --git a/applications/Notifications/websockets/ws_utils/__pycache__/manage_groups.cpython-38.pyc b/applications/Notifications/websockets/ws_utils/__pycache__/manage_groups.cpython-38.pyc[m
[1mindex 6a2c597..a2cfdcd 100644[m
Binary files a/applications/Notifications/websockets/ws_utils/__pycache__/manage_groups.cpython-38.pyc and b/applications/Notifications/websockets/ws_utils/__pycache__/manage_groups.cpython-38.pyc differ
[1mdiff --git a/applications/Notifications/websockets/ws_utils/__pycache__/messages_group_is_full.cpython-38.pyc b/applications/Notifications/websockets/ws_utils/__pycache__/messages_group_is_full.cpython-38.pyc[m
[1mnew file mode 100644[m
[1mindex 0000000..13b8914[m
Binary files /dev/null and b/applications/Notifications/websockets/ws_utils/__pycache__/messages_group_is_full.cpython-38.pyc differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/__pycache__/messages_group_name.cpython-38.pyc b/applications/Notifications/websockets/ws_utils/__pycache__/messages_group_name.cpython-38.pyc[m
[1msimilarity index 53%[m
[1mrename from applications/Chats/websockets/ws_utils/__pycache__/messages_group_name.cpython-38.pyc[m
[1mrename to applications/Notifications/websockets/ws_utils/__pycache__/messages_group_name.cpython-38.pyc[m
[1mindex 28f877b..8f8ae13 100644[m
Binary files a/applications/Chats/websockets/ws_utils/__pycache__/messages_group_name.cpython-38.pyc and b/applications/Notifications/websockets/ws_utils/__pycache__/messages_group_name.cpython-38.pyc differ
[1mdiff --git a/applications/Notifications/websockets/ws_utils/__pycache__/notification_websocket_is_opened.cpython-38.pyc b/applications/Notifications/websockets/ws_utils/__pycache__/notification_websocket_is_opened.cpython-38.pyc[m
[1mindex 60620bf..5d6ecca 100644[m
Binary files a/applications/Notifications/websockets/ws_utils/__pycache__/notification_websocket_is_opened.cpython-38.pyc and b/applications/Notifications/websockets/ws_utils/__pycache__/notification_websocket_is_opened.cpython-38.pyc differ
[1mdiff --git a/applications/Notifications/websockets/ws_utils/__pycache__/print_pretty_groups.cpython-38.pyc b/applications/Notifications/websockets/ws_utils/__pycache__/print_pretty_groups.cpython-38.pyc[m
[1mnew file mode 100644[m
[1mindex 0000000..df1639a[m
Binary files /dev/null and b/applications/Notifications/websockets/ws_utils/__pycache__/print_pretty_groups.cpython-38.pyc differ
[1mdiff --git a/applications/Chats/websockets/ws_utils/broadcast_dict.py b/applications/Notifications/websockets/ws_utils/broadcast_dict.py[m
[1msimilarity index 100%[m
[1mrename from applications/Chats/websockets/ws_utils/broadcast_dict.py[m
[1mrename to applications/Notifications/websockets/ws_utils/broadcast_dict.py[m
[1mdiff --git a/applications/Chats/websockets/ws_utils/broadcast_message.py b/applications/Notifications/websockets/ws_utils/broadcast_message.py[m
[1msimilarity index 100%[m
[1mrename from applications/Chats/websockets/ws_utils/broadcast_message.py[m
[1mrename to applications/Notifications/websockets/ws_utils/broadcast_message.py[m
[1mdiff --git a/applications/Notifications/websockets/ws_utils/get_opened_chat_groups_with_id.py b/applications/Notifications/websockets/ws_utils/get_opened_chat_groups_with_id.py[m
[1mindex 84722fb..8def366 100644[m
[1m--- a/applications/Notifications/websockets/ws_utils/get_opened_chat_groups_with_id.py[m
[1m+++ b/applications/Notifications/websockets/ws_utils/get_opened_chat_groups_with_id.py[m
[36m@@ -1,11 +1,15 @@[m
 from channels.layers import get_channel_layer[m
 from django.core.cache import cache[m
[32m+[m[32mfrom .manage_groups import manage_groups[m
[32m+[m[32mfrom applications.Usuarios.utils.constants import BASE_CHATS_WEBSOCKETS_GROUP_NAME[m
[32m+[m
[32m+[m
 def get_opened_chat_groups_with_id(target_id):[m
     """[m
         Retornara una lista de los grupos de chat que estan abiertos con el id del usuario[m
     """[m
     found_groups = [][m
[31m-    groups = cache.get("chats")[m
[32m+[m[32m    groups = manage_groups("get", BASE_CHATS_WEBSOCKETS_GROUP_NAME)[m
     if (groups):[m
         for group_name, channels in groups.items():[m
             try:[m
[1mdiff --git a/applications/Notifications/websockets/ws_utils/manage_groups.py b/applications/Notifications/websockets/ws_utils/manage_groups.py[m
[1mnew file mode 100644[m
[1mindex 0000000..49fbada[m
[1m--- /dev/null[m
[1m+++ b/applications/Notifications/websockets/ws_utils/manage_groups.py[m
[36m@@ -0,0 +1,21 @@[m
[32m+[m[32mfrom django.core.cache import cache[m
[32m+[m
[32m+[m[32mdef manage_groups(mode, branch, val=None):[m
[32m+[m[32m    groups = cache.get(branch) if cache.get(branch) else {}[m
[32m+[m[32m    if (mode  == "get"):[m
[32m+[m[32m        return groups[m
[32m+[m[32m    elif (mode in ["append", "discard"]):[m
[32m+[m[32m        group_name = val["group_name"][m
[32m+[m[32m        channel = val["channel_name"][m
[32m+[m[32m        if (mode == "append"):[m
[32m+[m[32m            if group_name in groups:[m
[32m+[m[32m                groups[group_name].append(channel)[m
[32m+[m[32m            else:[m
[32m+[m[32m                groups[group_name] = [channel][m
[32m+[m[32m        elif (mode == "discard"):[m
[32m+[m[32m            if channel in groups[group_name]:[m
[32m+[m[32m                groups[group_name].remove(channel)[m
[32m+[m[32m            if len(groups[group_name]) == 0:[m
[32m+[m[32m                groups.pop(group_name)[m
[32m+[m[32m        cache.set(branch, groups)[m
[32m+[m[32m        return groups[m
[1mdiff --git a/applications/Notifications/websockets/ws_utils/manage_notifications_groups.py b/applications/Notifications/websockets/ws_utils/manage_notifications_groups.py[m
[1mdeleted file mode 100644[m
[1mindex 8c1ec6f..0000000[m
[1m--- a/applications/Notifications/websockets/ws_utils/manage_notifications_groups.py[m
[1m+++ /dev/null[m
[36m@@ -1,22 +0,0 @@[m
[31m-from django.core.cache import cache[m
[31m-def manage_notifications_groups(mode,  val=None):[m
[31m-    groups = cache.get("notifications") if cache.get("notifications") else {}[m
[31m-    if (mode == 'get'):[m
[31m-        return groups[m
[31m-    [m
[31m-    elif (mode in ["append", "delete"]):[m
[31m-        if (mode == "append"):[m
[31m-            if (val["user_id"] in groups):[m
[31m-                groups[val["user_id"]].append(val["channel_name"])[m
[31m-            else:[m
[31m-                groups[val["user_id"]] = [val["channel_name"]][m
[31m-        elif (mode == "delete"):[m
[31m-            if (val["channel_name"] in groups[val["user_id"]]):[m
[31m-                groups[val["user_id"]].remove(val["channel_name"])[m
[31m-            if (len(groups[val["user_id"]]) == 0):[m
[31m-                groups.pop(val["user_id"])[m
[31m-[m
[31m-        cache.set("notifications", groups)[m
[31m-        return groups[m
[31m-[m
[31m-[m
[1mdiff --git a/applications/Chats/websockets/ws_utils/messages_group_is_full.py b/applications/Notifications/websockets/ws_utils/messages_group_is_full.py[m
[1msimilarity index 68%[m
[1mrename from applications/Chats/websockets/ws_utils/messages_group_is_full.py[m
[1mrename to applications/Notifications/websockets/ws_utils/messages_group_is_full.py[m
[1mindex 46883da..06903a2 100644[m
[1m--- a/applications/Chats/websockets/ws_utils/messages_group_is_full.py[m
[1m+++ b/applications/Notifications/websockets/ws_utils/messages_group_is_full.py[m
[36m@@ -1,10 +1,14 @@[m
 from channels.layers import get_channel_layer[m
 from .messages_group_name import messages_group_name[m
 from django.core.cache import cache[m
[32m+[m[32mfrom .manage_groups import manage_groups[m
[32m+[m[32mfrom applications.Usuarios.utils.constants import BASE_CHATS_WEBSOCKETS_GROUP_NAME[m
[32m+[m
[32m+[m
 def messages_group_is_full(id_1, id_2):[m
     """[m
         Recibe dos id's y retornara true en caso de que exista un grupo de mensajes con esos id's[m
         y que este full[m
     """[m
[31m-    messages_groups = cache.get("chats")[m
[32m+[m[32m    messages_groups = manage_groups("get", BASE_CHATS_WEBSOCKETS_GROUP_NAME)[m
     return (messages_group_name(id_1, id_2) in messages_groups) and (len(messages_groups[messages_group_name(id_1, id_2)])==2)[m
[1mdiff --git a/applications/Chats/websockets/ws_utils/messages_group_name.py b/applications/Notifications/websockets/ws_utils/messages_group_name.py[m
[1msimilarity index 100%[m
[1mrename from applications/Chats/websockets/ws_utils/messages_group_name.py[m
[1mrename to applications/Notifications/websockets/ws_utils/messages_group_name.py[m
[1mdiff --git a/applications/Notifications/websockets/ws_utils/notification_websocket_is_opened.py b/applications/Notifications/websockets/ws_utils/notification_websocket_is_opened.py[m
[1mindex 25c4b47..cb1fcce 100644[m
[1m--- a/applications/Notifications/websockets/ws_utils/notification_websocket_is_opened.py[m
[1m+++ b/applications/Notifications/websockets/ws_utils/notification_websocket_is_opened.py[m
[36m@@ -1,8 +1,11 @@[m
 from channels.layers import get_channel_layer[m
 from django.core.cache import cache[m
[32m+[m[32mfrom .manage_groups import manage_groups[m
[32m+[m[32mfrom applications.Usuarios.utils.constants import BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME[m
[32m+[m
[32m+[m
 def notification_websocket_is_opened(user_id):[m
     """[m
         Retornara True en caso de que exista algun grupo creado con el user_id como nombre[m
     """[m
[31m-    notifications_groups = cache.get("notifications")[m
[31m-    return str(user_id) in notifications_groups[m
[32m+[m[32m    return str(user_id) in manage_groups("get", BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME)[m
[1mdiff --git a/applications/Notifications/websockets/ws_utils/print_pretty_groups.py b/applications/Notifications/websockets/ws_utils/print_pretty_groups.py[m
[1mnew file mode 100644[m
[1mindex 0000000..952d8e1[m
[1m--- /dev/null[m
[1m+++ b/applications/Notifications/websockets/ws_utils/print_pretty_groups.py[m
[36m@@ -0,0 +1,20 @@[m
[32m+[m[32mfrom django.core.cache import cache[m
[32m+[m[32mimport logging[m
[32m+[m[32mfrom .manage_groups import manage_groups[m
[32m+[m[32mfrom applications.Usuarios.utils.constants import ([m
[32m+[m[32m    BASE_CHATS_WEBSOCKETS_GROUP_NAME,[m
[32m+[m[32m    BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME[m
[32m+[m[32m)[m
[32m+[m
[32m+[m[32mdef print_pretty_groups():[m
[32m+[m[32m    """[m
[32m+[m[32m        Imprimira los grupos actuales almacenados en el channel layer[m
[32m+[m[32m    """[m
[32m+[m[32m    logger = logging.getLogger('django.channels')[m
[32m+[m[32m    logger.info(" ------------------------------------------------ ")[m
[32m+[m[32m    modes = [BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME, BASE_CHATS_WEBSOCKETS_GROUP_NAME][m
[32m+[m[32m    for m in modes:[m
[32m+[m[32m        current_group = manage_groups("get", m)[m
[32m+[m[32m        if current_group:[m
[32m+[m[32m            for k,v in current_group.items():[m
[32m+[m[32m                logger.info(f'{k} -> {v}')[m
\ No newline at end of file[m
[1mdiff --git a/applications/RateLimit/__pycache__/middlewares.cpython-38.pyc b/applications/RateLimit/__pycache__/middlewares.cpython-38.pyc[m
[1mindex dfdcb35..3282c4f 100644[m
Binary files a/applications/RateLimit/__pycache__/middlewares.cpython-38.pyc and b/applications/RateLimit/__pycache__/middlewares.cpython-38.pyc differ
[1mdiff --git a/applications/Usuarios/__pycache__/managers.cpython-38.pyc b/applications/Usuarios/__pycache__/managers.cpython-38.pyc[m
[1mindex 4a05a7a..dff93f7 100644[m
Binary files a/applications/Usuarios/__pycache__/managers.cpython-38.pyc and b/applications/Usuarios/__pycache__/managers.cpython-38.pyc differ
[1mdiff --git a/applications/Usuarios/__pycache__/views.cpython-38.pyc b/applications/Usuarios/__pycache__/views.cpython-38.pyc[m
[1mindex 9ccaa58..4a8481e 100644[m
Binary files a/applications/Usuarios/__pycache__/views.cpython-38.pyc and b/applications/Usuarios/__pycache__/views.cpython-38.pyc differ
[1mdiff --git a/applications/Usuarios/managers.py b/applications/Usuarios/managers.py[m
[1mindex 3155dd9..4acc317 100644[m
[1m--- a/applications/Usuarios/managers.py[m
[1m+++ b/applications/Usuarios/managers.py[m
[36m@@ -5,6 +5,8 @@[m [mfrom .utils.constants import ([m
     USER_SHOWABLE_FIELDS)[m
 from .utils.add_istyping_field import add_istyping_field[m
 from django.core.cache import cache[m
[32m+[m[32mfrom applications.Notifications.websockets.ws_utils.manage_groups import manage_groups[m
[32m+[m[32mfrom .utils.constants import BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME[m
 [m
 [m
 class UsuariosManager(BaseUserManager):[m
[36m@@ -28,9 +30,8 @@[m [mclass UsuariosManager(BaseUserManager):[m
             Revisara si existe algun grupo con el id del usuario, basandose en el estandar de[m
             los websockets de notificaciones[m
         """[m
[31m-        # cache.set("notifications", {})[m
[31m-        # cache.set("chats", {})[m
[31m-        return cache.get("notifications") and (str(user_id) in cache.get('notifications'))[m
[32m+[m[32m        notifications_groups = manage_groups("get", BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME)[m
[32m+[m[32m        return  notifications_groups and (str(user_id) in notifications_groups)[m
     def activate_user(self, user):[m
         """[m
             Realiza las funciones necesarias para activar por completo[m
[1mdiff --git a/applications/Usuarios/utils/__pycache__/constants.cpython-38.pyc b/applications/Usuarios/utils/__pycache__/constants.cpython-38.pyc[m
[1mindex b7f3a6d..0b7790f 100644[m
Binary files a/applications/Usuarios/utils/__pycache__/constants.cpython-38.pyc and b/applications/Usuarios/utils/__pycache__/constants.cpython-38.pyc differ
[1mdiff --git a/applications/Usuarios/utils/constants.py b/applications/Usuarios/utils/constants.py[m
[1mindex e03eaa9..ab22d09 100644[m
[1m--- a/applications/Usuarios/utils/constants.py[m
[1m+++ b/applications/Usuarios/utils/constants.py[m
[36m@@ -6,6 +6,8 @@[m [mBASE_USERNAME_MAX_LENGTH = 15[m
 BASE_EMAIL_MAX_LENGTH = 60[m
 BASE_PASSWORD_MAX_LENGTH = 30[m
 BASE_SECURITY_CODE_MAX_LENGTH = 10[m
[32m+[m[32mBASE_CHATS_WEBSOCKETS_GROUP_NAME = "chats"[m
[32m+[m[32mBASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME = "notifications"[m
 USER_SHOWABLE_FIELDS = [[m
     "username",[m
     "email",[m
[1mdiff --git a/applications/Usuarios/websockets/ws_utils/__pycache__/get_notifications_groups.cpython-38.pyc b/applications/Usuarios/websockets/ws_utils/__pycache__/get_notifications_groups.cpython-38.pyc[m
[1mindex ba41df6..ed9af7f 100644[m
Binary files a/applications/Usuarios/websockets/ws_utils/__pycache__/get_notifications_groups.cpython-38.pyc and b/applications/Usuarios/websockets/ws_utils/__pycache__/get_notifications_groups.cpython-38.pyc differ
[1mdiff --git a/applications/Usuarios/websockets/ws_utils/get_notifications_groups.py b/applications/Usuarios/websockets/ws_utils/get_notifications_groups.py[m
[1mindex b7c7d17..b70a300 100644[m
[1m--- a/applications/Usuarios/websockets/ws_utils/get_notifications_groups.py[m
[1m+++ b/applications/Usuarios/websockets/ws_utils/get_notifications_groups.py[m
[36m@@ -1,12 +1,14 @@[m
 from django.core.cache import cache[m
 from channels.layers import get_channel_layer[m
[32m+[m[32mfrom applications.Notifications.websockets.ws_utils.manage_groups import manage_groups[m
[32m+[m[32mfrom applications.Usuarios.utils.constants import BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME[m
 def get_notifications_groups(session_user_id):[m
     """[m
         Retornara la lista de los nombres de los actuales canales de[m
         notificaciones abiertos exceptuando el canal del session_user[m
     """[m
     opened_notifications_websockets = [][m
[31m-    notifications_groups = cache.get("notifications")[m
[32m+[m[32m    notifications_groups = manage_groups("get", BASE_NOTIFICATIONS_WEBSOCKETS_GROUP_NAME)[m
     for group_name, channels in notifications_groups.items():[m
         if (str(session_user_id) != group_name) and (len(group_name.split('-')) == 1):[m
             opened_notifications_websockets.append(group_name)[m
[1mdiff --git a/logs/websocket.log b/logs/websocket.log[m
[1mnew file mode 100644[m
[1mindex 0000000..e69de29[m
