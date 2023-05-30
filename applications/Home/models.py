from django.db import models

# Create your models here.
class Home(models.Model):
    header = models.CharField(max_length=30)
    description = models.CharField(max_length=40)

