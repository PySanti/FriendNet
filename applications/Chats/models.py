from django.db import models
from applications.Usuarios.models import Usuarios
from .managers import (
    ChatsManager,
    MessagesManager
)

# Create your models here.

class Messages(models.Model):
    parent = models.ForeignKey(Usuarios, on_delete=models.DO_NOTHING)
    content = models.CharField(max_length=200)
    #manager
    objects = MessagesManager()
    def __str__(self) -> str:
        return f"""
        {self.parent.username} : {self.content}
        """

class Chats(models.Model):
    users = models.ManyToManyField(Usuarios)
    messages = models.ManyToManyField(Messages)
    # manager
    objects = ChatsManager() 
    def __str__(self) -> str:
        users = list(self.users.all())
        return f"""
        {users[0].username} - {users[1].username}
        """
