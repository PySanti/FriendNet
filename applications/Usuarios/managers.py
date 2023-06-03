from django.contrib.auth.models import BaseUserManager
from django.contrib.auth import login, authenticate

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
    def checkActivationCode(self, user_id, code):
        return self.get(id=user_id).activation_code == code
    def activeUser(self, user_id, request):
        user = self.get(id=user_id)
        user.is_active = True
        user.is_online = True
        user.save()
        login(request=request, user=user)
    def connectUser(self, user_id):
        user=self.get(id=user_id)
        user.is_online = True
        user.save()
    def disconnectUser(self, user_id):
        user=self.get(id=user_id)
        user.is_online = False
        user.save()



