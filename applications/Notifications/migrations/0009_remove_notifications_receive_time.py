# Generated by Django 4.2.1 on 2023-07-20 12:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Notifications', '0008_notifications_code'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notifications',
            name='receive_time',
        ),
    ]
