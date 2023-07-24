from django.db.models import manager


class ChatsManager(manager.Manager):
    def _chatBetween(self, id_1, id_2):
        """
            Busca el chat entre el usuario con id_1 y id_2, en caso de no existir
            retorna None
        """
        chat = self.filter(users_id__contains=id_1).filter(users_id__contains=id_2)
        return chat[0] if chat else None
    def sendMessage(self, sender_user, receiver_user, new_message):
        """
            Envia un mensaje de un usuario a otro
        """
        chat_between = self._chatBetween(sender_user.id, receiver_user.id)
        if not chat_between:
            chat_between = self.create(users_id=f"{sender_user.id},{receiver_user.id}")
        chat_between.messages.add(new_message)
        chat_between.save()
    def getMessagesHistorial(self, session_user_id, chat_user_id):
        """
            Retorna el historial de mensajes entre session_user
            y chat_user en caso de existir, en caso contrario, retorna None
        """
        chat = self._chatBetween(session_user_id, chat_user_id)
        return chat.messages.all() if chat else None