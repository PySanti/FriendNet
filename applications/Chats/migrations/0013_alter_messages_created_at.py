# Generated by Django 4.2.1 on 2024-01-31 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Chats', '0012_alter_messages_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messages',
            name='created_at',
            field=models.CharField(max_length=21),
        ),
    ]
