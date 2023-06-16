from django.db import models
from .manager import NotificationsManager


# Create your models here.
class Notifications(models.Model):
    msg = models.CharField(max_length=50)
    receive_time = models.DateTimeField(auto_now_add=True)
    objects = NotificationsManager()
