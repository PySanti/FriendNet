# Generated by Django 4.2.1 on 2023-11-30 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Chats', '0010_messages_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messages',
            name='created_at',
            field=models.CharField(max_length=20),
        ),
    ]
