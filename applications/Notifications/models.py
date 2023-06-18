from django.db import models
from .manager import NotificationsManager


# Create your models here.
class Notifications(models.Model):
    # El atributo code representa el codigo de tipo de notificacion:
    # si es un numero, se trata del id del usuario que envio el mensaje
    # si es la letra u, se trata de una notificacion por update del perfil
    code = models.CharField(max_length=5, default=None)
    msg = models.CharField(max_length=50)
    receive_time = models.DateTimeField(auto_now_add=True)
    objects = NotificationsManager()

    def __str__(self) -> str:
        return f"{self.code}, {self.msg}, {self.receive_time}"
