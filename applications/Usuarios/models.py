from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from applications.Notifications.models import Notifications
from .managers import UsuariosManager
from .utils.constants import (BASE_USERNAME_MAX_LENGTH, BASE_EMAIL_MAX_LENGTH, BASE_SECURITY_CODE_MAX_LENGTH)

# Create your models here.
class Usuarios(AbstractBaseUser, PermissionsMixin):
    """
        Modelo creado para almacenamiento de todo tipo de usuarios
    """
    #* BASE ATTRS

    username        = models.CharField(max_length=BASE_USERNAME_MAX_LENGTH, unique=True)
    email           = models.EmailField(unique=True, max_length=BASE_EMAIL_MAX_LENGTH)
    is_staff        = models.BooleanField()
    REQUIRED_FIELDS = ['email']
    USERNAME_FIELD  = 'username'
    #* NEW ATTRS
    photo_link      = models.CharField(max_length=120, null=True)
    is_active       = models.BooleanField(default=False)
    notifications   = models.ManyToManyField(Notifications, blank=True)
    security_code            = models.CharField(blank=True, max_length=BASE_SECURITY_CODE_MAX_LENGTH)
    #* MANAGER
    objects         = UsuariosManager()

    def __str__(self):
        return f"{self.username}, {self.id}"
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    

