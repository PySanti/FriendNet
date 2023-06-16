from django.db.models import manager


class MessagesManager(manager.Manager):
    def CreateMessage(self, parent_id, msg):
        """
            Crea un objecto mensaje y lo retorna mensaje 
        """
        return self.create(parent_id=parent_id, content=msg)



class ChatsManager(manager.Manager):
    def chatBetween(self, id_1, id_2):
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
        chat_between = self.chatBetween(sender_user.id, receiver_user.id)
        if not chat_between:
            chat_between = self.create(users_id=f"{receiver_user.id},{receiver_user.id}")
        chat_between.messages.add(new_message)
        chat_between.save()