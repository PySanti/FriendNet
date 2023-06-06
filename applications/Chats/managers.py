from django.db.models import manager

class ChatsManager(manager.Manager):
    def chatBetween(self, id_1, id_2):
        """
            Busca el chat entre el usuario con id_1 y id_2, en caso de no existir
            retorna None
        """
        chat = self.filter(users_id__contains=id_1).filter(users_id__contains=id_2)
        return chat[0] if chat else None