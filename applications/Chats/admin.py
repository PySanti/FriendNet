from django.contrib import admin
from .models import (
    Chat,
    Messages
)

# Register your models here.

admin.site.register(Chat)
admin.site.register(Messages)
