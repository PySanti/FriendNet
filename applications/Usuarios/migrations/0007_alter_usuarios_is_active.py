# Generated by Django 4.2.1 on 2023-06-03 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Usuarios', '0006_usuarios_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuarios',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
