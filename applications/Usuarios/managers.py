from django.contrib.auth.models import BaseUserManager
from django.db.models import Case, When, IntegerField
from .utils.constants import (
    USERS_LIST_ATTRS,

    USER_SHOWABLE_FIELDS)
from .utils.add_istyping_field import add_istyping_field
from applications.Notifications.websockets.ws_utils.get_redis_groups import get_redis_groups


class UsuariosManager(BaseUserManager):
    def _create_user(self, username, password, email, is_staff, is_superuser, **kwargs):
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
    def user_is_online(self, user_id):
        """
            Revisara si existe algun grupo con el id del usuario, basandose en el estandar de
            los websockets de notificaciones
        """
        notifications_groups = get_redis_groups("notifications")
        return  notifications_groups and (str(user_id) in notifications_groups)
    def activate_user(self, user):
        """
            Realiza las funciones necesarias para activar por completo
            a un usuario despues de haber sido creado
        """
        user.is_active = True
        user.save()
    def deactivate_user(self, user):
        user.is_active = False
        user.save()
    def get_formated_notifications(self, user):
        """
            Recibe el usuario y retorna la lista de notificaciones del usuario formateada
        """
        senders_ids = []
        notifications_list = {}
        for  i in user.notifications.all():
            if i.sender_user_id not in senders_ids:
                senders_ids.append(i.sender_user_id)
            notifications_list[i.sender_user_id] = ({ 'id' : i.id, 'msg' : i.msg})
        # recordar que hacemos la solicitud de esta manera, para evitar hacer una solicitud por cada iteracion del bucle
        senders_users = {i['id']:i for i in add_istyping_field(self.filter(id__in=senders_ids).values(*USERS_LIST_ATTRS))}
        for i in notifications_list.keys():
            if i in senders_users.keys():
                notifications_list[i]['sender_user']=senders_users[i]
            else:
                notifications_list.pop(i)
        return notifications_list
    def get_formated_user_data(self, user):
        """
            Recibe al usuario y retorna sus datos formateados
        """
        base_user_data = {i[0]:i[1] for i in user.__dict__.items() if i[0] in USER_SHOWABLE_FIELDS}
        return base_user_data
    def change_password(self, user, new_password):
        """
            Recibe el usuario y su nueva contraseña y la settea 
        """
        user.set_password(new_password)
        user.save()
    def set_security_code(self, user, security_code):
        user.security_code = security_code
        user.save()
    def user_exists(self, username=None, email=None):
        """
            Retorna true en caso de que exista algun usuario con username o email
        """
        return True if ((username and self.filter(username__iexact=username)) or (email and self.filter(email=email))) else False
    def update_user(self, user, new_data):
        """
            Recibe el id de un usuario y sus nuevos datos y lo actualiza
        """
        # recordar que se deberia comprobar si el usuario realmente esta cambiando algo desde el frontend
        user.username       = new_data['username']
        user.email          = new_data['email']
        user.photo_link     = new_data['photo_link']
        user.save()
        return user
    def set_email(self, user, new_email):
        """
            Recibe al usuario y modifica su email con new_email
        """
        user.email = new_email
        user.save()
    
    def get_filtered_users_list(self, session_user, recent_messages_ids, user_keyword):
        """
            Se encargara de buscar la lista de usuarios para la view GetUsersList
        """
        if recent_messages_ids != None:
            users_list = self.annotate(
            custom_order=Case(
                *[When(id=id_val, then=pos) for pos, id_val in enumerate(recent_messages_ids)],
                default=len(recent_messages_ids) + 1,
                output_field=IntegerField(),
            )
            ).filter(
                is_active=True
            ).exclude(
                id=session_user.id
            ).order_by('custom_order')
        else:
            users_list = self.filter(is_active=True).exclude(id=session_user.id)
        if user_keyword:
            users_list = users_list.filter(username__icontains=user_keyword)
        
        return users_list