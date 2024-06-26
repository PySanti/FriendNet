# Generated by Django 4.2.1 on 2023-06-18 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Notifications', '0008_notifications_code'),
        ('Usuarios', '0013_usuarios_notifications'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuarios',
            name='notifications',
            field=models.ManyToManyField(blank=True, to='Notifications.notifications'),
        ),
        migrations.AlterField(
            model_name='usuarios',
            name='username',
            field=models.CharField(max_length=15, unique=True),
        ),
    ]
