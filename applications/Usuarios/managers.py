from django.contrib.auth.models import BaseUserManager
from django.contrib.auth import login
from django.utils.timezone import  now
from django.contrib.auth.hashers import check_password
from .utils.constants import (
    USERS_LIST_ATTRS,
    USER_SHOWABLE_FIELDS)

class UsuariosManager(BaseUserManager):
    def _create_user(self, username, password, email, is_staff, is_superuser, **kwargs):
        kwargs['first_names'], kwargs['last_names'] = self.formatNames(kwargs['first_names']), self.formatNames(kwargs['last_names'])
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
    def setUserConection(self, user, conection):
        """
            Settea el atributo is_online del user a conection
        """
        user.is_online = conection
        user.save()
    def formatNames(self, name):
        """
            Recibe un nombre y lo retorna formateado
        """
        return ' '.join([i.capitalize() for i in name.lower().split(' ')])
    def create_superuser(self, username, password, email, **kwargs):
        return self._create_user(username, password, email, True, True, **kwargs)
    def create_user(self, username, password, email, **kwargs):
        return self._create_user(username, password, email, False, False, **kwargs)
    def activateUser(self, user):
        """
            Realiza las funciones necesarias para activar por completo
            a un usuario despues de haber sido creado
        """
        user.is_active = True
        user.save()
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
            if i['sender_user'] in senders_users:
                i['sender_user']=senders_users[i['sender_user']]
            else:
                notifications_list.pop(notifications_list.index(i))
        return notifications_list
    def getFormatedUserData(self, user):
        """
            Recibe al usuario y retorna sus datos formateados
        """
        base_user_data = {i[0]:i[1] for i in user.__dict__.items() if i[0] in USER_SHOWABLE_FIELDS}
        base_user_data['notifications'] = self.getFormatedNotifications(user)
        return base_user_data
    def changePassword(self, user, new_password):
        """
            Recibe el usuario y su nueva contraseña y la settea 
        """
        user.set_password(new_password)
        user.save()
    def userExists(self, username, email=None):
        """
            Retorna true en caso de que exista algun usuario con username o email
        """
        return (self.filter(username=username)) or (self.filter(email=email))
    def updateUser(self, user, new_data):
        """
            Recibe el id de un usuario y sus nuevos datos y lo actualiza
        """
        # recordar que se deberia comprobar si el usuario realmente esta cambiando algo desde el frontend
        user.username       = new_data['username']
        user.email          = new_data['email']
        user.first_names    = new_data['first_names']
        user.last_names     = new_data['last_names']
        user.age            = new_data['age']
        user.photo_link     = new_data['photo_link']
        user.save()
        return user
    def setEmail(self, user, new_email):
        """
            Recibe al usuario y modifica su email con new_email
        """
        user.email = new_email
        user.save()
