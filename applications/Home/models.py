from django.db import models

# Create your models here.
class Home(models.Model):
    """
        Clase creada para almacenar dentro de la DB la informacion del Home
    """
    header = models.CharField(max_length=30)
    description = models.CharField(max_length=40)

