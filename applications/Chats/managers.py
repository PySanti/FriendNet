from django.db.models import manager
from datetime import datetime
from babel.dates import format_datetime

class ChatsManager(manager.Manager):
    def _chat_between(self, id_1, id_2):
        """
            Busca el chat entre el usuario con id_1 y id_2, en caso de no existir
            retorna None
        """
        chat = self.filter(users__id=id_1).filter(users__id=id_2)
        return chat[0] if chat else None
    def _get_messages_historial(self, session_user_id, chat_user_id):
        """
            Retorna el historial de mensajes entre session_user
            y chat_user en caso de existir, en caso contrario, retorna None
        """
        chat = self._chat_between(session_user_id, chat_user_id)
        return chat.messages.all().order_by('-id') if chat else None
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
    def get_messages_historial_ready(self, request, receiver_id, api):
        """
            Retornara el historial de mensajes paginado  en un diccionario en caso de que existan mensajes entre 
            los usuarios
        """
        messages_hist = self._get_messages_historial(request.user.id, receiver_id)
        if (messages_hist):
            try:
                messages_hist = api.pagination_class().paginate_queryset(messages_hist.values(), request)[::-1]
                return {"messages_hist" : messages_hist}
            except Exception:
                return "no_more_pages"
        else:
            return {"messages_hist" : "no_messages_between"}


class MessagesManager(manager.Manager):
    def create_message(self, parent, content):
        new_message = self.create(parent=parent, content=content, created_at=format_datetime(datetime.now(), "MMM dd YYYY, HH:mm", locale='es_ES').capitalize())
        return new_message
