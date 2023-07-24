# Generated by Django 4.2.1 on 2023-07-24 12:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Notifications', '0009_remove_notifications_receive_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notifications',
            name='code',
        ),
        migrations.AddField(
            model_name='notifications',
            name='sender_user_id',
            field=models.SmallIntegerField(default=None, null=True),
        ),
    ]
