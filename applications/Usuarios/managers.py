from django.contrib.auth.models import BaseUserManager
from django.contrib.auth import login
from django.utils.timezone import  now
from django.contrib.auth.hashers import check_password
from .utils import (
    USERS_LIST_ATTRS
)
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
    def deleteAllNotifications(self, user):
        """
            Recibe un usuario y elimina todas sus notificaciones
        """
        user.notifications.all().delete()
        user.save()
    def dispatchUserNotifications(self,user):
        """
            Recibe un usuario y retorna la lista de notificaciones del usuario formateadas y las elimina
        """
        notifications_list = self.getFormatedNotifications(user)
        self.deleteAllNotifications(user)
        return notifications_list
    def getFormatedNotifications(self, user):
        """
            Recibe el usuario y retorna la lista de notificaciones del usuario formateada
        """
        senders_ids = []
        notifications_list = []
        for  i in user.notifications.all():
            if i.sender_user_id not in senders_ids:
                senders_ids.append(i.sender_user_id)
            notifications_list.append({ 'msg' : i.msg, 'sender_user' : i.sender_user_id})
        # recordar que hacemos la solicitud de esta manera, para evitar hacer una solicitud por cada iteracion del bucle
        senders_users = {i['id']:i for i in self.filter(id__in=senders_ids).values(*USERS_LIST_ATTRS)}
        for i in notifications_list:
            i['sender_user']=senders_users[i['sender_user']]
        return notifications_list

    def getCleanedUserData(self, user):
        USERS_TRADUCTION_ATTRS = {
            'username' : 'Usuario',
            'email' : 'Correo',
            'first_names' : 'Nombres',
            'last_names' : 'Apellidos',
            'age' : 'Edad',
        }
        NOT_TEMPLATEABLE_ATTRS = ['id', 'password', 'last_login', 'is_superuser', 'is_staff', 'is_online', '_state', 'photo', 'is_active', 'activation_code', 'chats']
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
    def isExistingUnactiveUser(self, username, password):
        """
            Retorna el usuario en caso de que 
            exista pero no este activo todavia,
            retorna False en caso de que le usuario
            no exista
        """
        pos_user_queryset = self.filter(username=username)
        if pos_user_queryset and check_password(password, pos_user_queryset[0].password) and (not pos_user_queryset[0].is_active):
            return pos_user_queryset[0]
        else:
            return False
    def userExists(self, username, email=None):
        return (self.filter(username=username)) or (self.filter(email=email))
