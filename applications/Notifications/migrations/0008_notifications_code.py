# Generated by Django 4.2.1 on 2023-06-16 02:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Notifications', '0007_delete_notificationslist'),
    ]

    operations = [
        migrations.AddField(
            model_name='notifications',
            name='code',
            field=models.CharField(default=None, max_length=5),
        ),
    ]
