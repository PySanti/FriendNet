# Generated by Django 4.2.1 on 2023-06-24 17:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Usuarios', '0020_alter_usuarios_photo_link'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='usuarios',
            unique_together=set(),
        ),
    ]
