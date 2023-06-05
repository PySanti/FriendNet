from django.db import models

# Create your models here.

class Messages(models.Model):
    parent_id = models.PositiveIntegerField()
    content = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.parent_id} : {self.content}"

class Chat(models.Model):
    user_id = models.PositiveSmallIntegerField()
    messages = models.ManyToManyField(Messages)

    def __str__(self):
        info = f"chat with {self.user_id}"
        return info