from django.contrib import admin
from .models import (
    Chats,
    Messages
)

# Register your models here.

admin.site.register(Chats)
admin.site.register(Messages)
