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
    username        = models.CharField(max_length=8, unique=True)
    email           = models.EmailField(unique=True)
    is_staff        = models.BooleanField()
    REQUIRED_FIELDS = ['email', 'first_names', 'last_names', 'age']
    USERNAME_FIELD  = 'username'
    #* NEW ATTRS
    first_names     = models.CharField(max_length=20)
    last_names      = models.CharField(max_length=25)
    age             = models.PositiveSmallIntegerField()
    photo           = models.ImageField(upload_to='media/', blank=True)
    is_online       = models.BooleanField(default=False)
    is_active       = models.BooleanField(default=False)
    activation_code = models.CharField(max_length=6)
    current_status  = models.CharField(default='bored',max_length=15)
    notifications   = models.ManyToManyField(Notifications)
    #* MANAGER
    objects         = UsuariosManager()

    def __str__(self):
        return f"{self.username}"

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        unique_together = ['first_names', 'last_names']





