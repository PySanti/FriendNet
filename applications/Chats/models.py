from django.db import models
from .managers import (
    ChatsManager,
    MessagesManager
)

# Create your models here.

class Messages(models.Model):
    parent_id = models.PositiveIntegerField()
    content = models.CharField(max_length=200)
    objects = MessagesManager()

    def __str__(self):
        return f"{self.parent_id} : {self.content}"
class Chat(models.Model):
    users_id = models.CharField(max_length=10, default=None)
    messages = models.ManyToManyField(Messages)
    # manager
    objects = ChatsManager() 

    def __str__(self):
        info = f"chat with {self.users_id}"
        return info