from django.db import models
from .managers import NotificationsManager


# Create your models here.
class Notifications(models.Model):
    # El atributo code representa el codigo de tipo de notificacion:
    # si es un numero, se trata del id del usuario que envio el mensaje
    # si es la letra u, se trata de una notificacion por update del perfil
    code = models.CharField(max_length=5, default=None)
    msg = models.CharField(max_length=50)
    objects = NotificationsManager()

    def __str__(self) -> str:
        return f"{self.code}, {self.msg}"
