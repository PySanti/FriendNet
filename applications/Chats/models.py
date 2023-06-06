from django.db import models
from .managers import ChatsManager

# Create your models here.

class Messages(models.Model):
    parent_id = models.PositiveIntegerField()
    content = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.parent_id} : {self.content}"

class Chat(models.Model):
    users_id = models.CharField(max_length=3, default=None)
    messages = models.ManyToManyField(Messages)
    # manager
    objects = ChatsManager() 

    def __str__(self):
        info = f"chat with {self.users_id}"
        return info