from django.db import models
from .managers import NotificationsManager


# Create your models here.
class Notifications(models.Model):
    # recordar que en este punto, no usamos ForeignKey directamente, ya que esto causaria un "circular import"
    sender_user_id = models.SmallIntegerField(null=False)
    msg = models.CharField(max_length=46)
    objects = NotificationsManager()

    def __str__(self) -> str:
        return f"{self.sender_user_id}, {self.msg}"
