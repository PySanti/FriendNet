from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from applications.Notifications.models import Notifications
from .managers import UsuariosManager

# Create your models here.
class Usuarios(AbstractBaseUser, PermissionsMixin):
    """
        Modelo creado para almacenamiento de todo tipo de usuarios
    """
    #* BASE ATTRS

    username        = models.CharField(max_length=15, unique=True)
    email           = models.EmailField(unique=True)
    is_staff        = models.BooleanField()
    REQUIRED_FIELDS = ['email']
    USERNAME_FIELD  = 'username'
    #* NEW ATTRS
    photo_link      = models.CharField(max_length=120, null=True)
    is_online       = models.BooleanField(default=False)
    is_active       = models.BooleanField(default=False)
    notifications   = models.ManyToManyField(Notifications, blank=True)
    #* MANAGER
    objects         = UsuariosManager()

    def __str__(self):
        return f"{self.username}"
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

