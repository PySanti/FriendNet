# Generated by Django 4.2.1 on 2023-05-29 20:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Usuarios', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuarios',
            name='current_status',
            field=models.CharField(default='bored', max_length=15),
        ),
        migrations.AlterField(
            model_name='usuarios',
            name='is_online',
            field=models.BooleanField(default=False),
        ),
    ]