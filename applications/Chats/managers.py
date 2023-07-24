from django.db.models import manager


class ChatsManager(manager.Manager):
    def _chatBetween(self, id_1, id_2):
        """
            Busca el chat entre el usuario con id_1 y id_2, en caso de no existir
            retorna None
        """
        chat = self.filter(users__id=id_1).filter(users__id=id_2)
        return chat[0] if chat else None
    def createChat(self, user_1, user_2):
        """
            Recibe dos usuarios y crea un chat entre ellos
        """
        new_chat = self.create()
        new_chat.users.add(user_1)
        new_chat.users.add(user_2)
        new_chat.save()
        return new_chat

    def sendMessage(self, sender_user, receiver_user, new_message):
        """
            Envia un mensaje de un usuario a otro
        """
        chat_between = self._chatBetween(sender_user.id, receiver_user.id)
        if not chat_between:
            chat_between = self.createChat(sender_user, receiver_user)

        chat_between.messages.add(new_message)
        chat_between.save()
    def getMessagesHistorial(self, session_user_id, chat_user_id):
        """
            Retorna el historial de mensajes entre session_user
            y chat_user en caso de existir, en caso contrario, retorna None
        """
        chat = self._chatBetween(session_user_id, chat_user_id)
        return chat.messages.all() if chat else None


class MessagesManager(manager.Manager):
    def createMessage(self, parent, content):
        new_message = self.create(parent=parent, content=content)
        return new_message
