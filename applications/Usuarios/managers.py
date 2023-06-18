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
        return False
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
    def getCleanedUserData(self, user):
        USERS_TRADUCTION_ATTRS = {
            'username' : 'Usuario',
            'email' : 'Correo',
            'first_names' : 'Nombres',
            'last_names' : 'Apellidos',
            'age' : 'Edad',
        }
        NOT_TEMPLATEABLE_ATTRS = ['id', 'password', 'last_login', 'is_superuser', 'is_staff', 'is_online', 'current_status', '_state', 'photo', 'is_active', 'activation_code', 'chats']
        cleaned_usuario_dict = {
            USERS_TRADUCTION_ATTRS[i[0]]:i[1] for i in user.__dict__.items() if i[0] not in NOT_TEMPLATEABLE_ATTRS
        }
        return cleaned_usuario_dict
    def updateUserWithData(self, user, data):
        user.username = data['username']
        user.email = data['email']
        user.first_names = data['first_names']
        user.last_names = data['last_names']
        user.age = data['age']
        user.photo = data['photo']
        user.save()
    def changePassword(self, user, new_password):
        user.set_password(new_password)
        user.save()
