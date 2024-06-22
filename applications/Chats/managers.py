from applications.Usuarios.utils.convert_to_datetime import convert_to_datetime
from django.db.models import manager
from .utils.getCurrentFormatedDate import getCurrentFormatedDate
from django.core.cache import cache

class ChatsManager(manager.Manager):
    def _chat_between(self, id_1, id_2):
        """
            Busca el chat entre el usuario con id_1 y id_2, en caso de no existir
            retorna None
        """
        chat = self.filter(users__id=id_1).filter(users__id=id_2)
        return chat[0] if chat else None
    def get_last_message_ref(self, id_1, id_2):
        """
            Retornara el id del ultimo mensaje entre el id_1 y el id_2.
        """
        chat = self._chat_between(id_1, id_2)
        if (chat and len(chat.messages.all()) > 0):
            return chat.messages.latest("id").id
        else:
            return None
    def _get_all_messages_from_ref(self, session_user_id, chat_user_id):
        """
            Retorna el historial de mensajes entre session_user
            y chat_user a partir del message de referencia
            en caso de existir, en caso contrario, retorna None
        """
        message_pagination_ref = cache.get(f"message_pagination_ref_{session_user_id}")
        if not message_pagination_ref:
            return None
        else:
            chat = self._chat_between(session_user_id, chat_user_id)
            return chat.messages.filter(id__lte=message_pagination_ref).order_by('-id') if chat else None
    def _create_chat(self, user_1, user_2):
        """
            Recibe dos usuarios y crea un chat entre ellos
        """
        new_chat = self.create()
        new_chat.users.add(user_1)
        new_chat.users.add(user_2)
        new_chat.save()
        return new_chat
    def send_message(self, sender_user, receiver_user, new_message):
        """
            Envia un mensaje de un usuario a otro
        """
        chat_between = self._chat_between(sender_user.id, receiver_user.id)
        if not chat_between:
            chat_between = self._create_chat(sender_user, receiver_user)

        chat_between.messages.add(new_message)
        chat_between.save()
    def get_messages_historial_page(self, request, receiver_id, api):
        """
            Retornara el historial de mensajes paginado  en un diccionario en caso de que existan mensajes entre 
            los usuarios
        """
        messages_from_ref = self._get_all_messages_from_ref(request.user.id, receiver_id)
        if (messages_from_ref):
            try:
                final_page = api.pagination_class().paginate_queryset(messages_from_ref.values(), request)[::-1]
                return {"messages_hist" : final_page}
            except Exception:
                return "no_more_pages"
        else:
            return {"messages_hist" : "no_messages_between"}
    def recent_message_id_list(self, session_user):
        asociated_chats = self.all().filter(users__id=session_user.id)
        recent_dict = {}
        for chat in asociated_chats:
            chat_users = chat.users.all()
            recent_message = chat.messages.order_by('-id').first()
            if (chat_users.count() == 2) and (recent_message):
                recent_dict[chat_users.exclude(id=session_user.id)[0].id] = convert_to_datetime(recent_message.created_at)
        sorted_values = list(recent_dict.values()).copy()
        sorted_values.sort()
        id_list = [0 for i in range(len(sorted_values))]
        for user_id, date in recent_dict.items():
            sorted_index = sorted_values.index(date)
            if (id_list[sorted_index] == 0):
                id_list[sorted_index] = user_id
            else:
                for i in range(sorted_index, len(sorted_values)):
                    if (id_list[i] == 0):
                        id_list[i] = user_id
                        break
        return id_list[-1::-1] if id_list else None



class MessagesManager(manager.Manager):
    def create_message(self, parent, content):
        new_message = self.create(parent=parent, content=content, created_at=getCurrentFormatedDate())
        return new_message
