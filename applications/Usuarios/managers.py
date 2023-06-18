from django.contrib.auth.models import BaseUserManager
from django.contrib.auth import login
from django.utils.timezone import  now
from .tools import getFormatedDateDiff

class UsuariosManager(BaseUserManager):
    def _create_user(self, username, password, email, is_staff, is_superuser, **kwargs):
        # BUG : Agregar usuarios con uppercase en first_names y last_names
        new_user = self.model(
            username = username,
            email = email,
            is_staff = is_staff,
            is_superuser = is_superuser,
            **kwargs
        )
        new_user.set_password(password)
        new_user.save(using=self.db)
        return new_user
    def create_superuser(self, username, password, email, **kwargs):
        return self._create_user(username, password, email, True, True, **kwargs)
    def create_user(self, username, password, email, **kwargs):
        return self._create_user(username, password, email, False, False, **kwargs)
    def checkActivationCode(self, user_id : int, code : str):
        """
            Comprueba que el codigo enviado por parametro es igual al
            codigo asociado al usuario. Manager creado para activacion 
            de usuario
        """
        return self.get(id=user_id).activation_code == code
    def activeUser(self, user_id : int, request):
        """
            Realiza las funciones necesarias para activar por completo
            a un usuario despues de haber sido creado
        """
        user = self.get(id=user_id)
        user.is_active = True
        user.is_online = True
        user.save()
        login(request=request, user=user)
    def connectUser(self, user_id : int):
        """
            Settea el atributo is_online=True
        """
        user=self.get(id=user_id)
        user.is_online = True
        user.save()
    def disconnectUser(self, user_id : int):
        """
            Settea el atributo is_online=False
        """
        user=self.get(id=user_id)
        user.is_online = False
        user.save()
    def dataIsDiferent(self, user, data : dict):
        """
            Comprueba que los datos del diccionario data son diferentes
            a los datos contenidos por el usuario. Metodo creado para
            optimizar la actualizacion de usuarios
        """
        user_dict = user.__dict__
        for item in data.items():
            if user_dict[item[0]] != item[1]:
                return True
        return True

    def getChatBetween(self,session_user, with_user_id):
        """
            Retorna objeto chat con el usuario con id with_id.
            En caso de que ese chat no exista, retorna None
        """
        chat = session_user.chats.filter(user_id=with_user_id)
        if not chat:
            return None
        else:
            return chat[0]
    def getParsedNotifications(self,user):
        """
            Recibe un usuario y retorna la lista de notificaciones del usuario
            en forma de tuplas:
                n[0] : mensaje
                n[1] : datetime de envio
                n[2] : codigo de notificacion
        """

        return [ (i.msg, getFormatedDateDiff(now(), i.receive_time), i.code) for  i in user.notifications.all()]

    def setState(self, user, new_state):
        user.current_status = new_state
        user.save()



