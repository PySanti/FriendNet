# Generated by Django 4.2.1 on 2023-07-30 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Usuarios', '0022_alter_usuarios_photo_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuarios',
            name='photo_link',
            field=models.CharField(max_length=99, null=True),
        ),
    ]
