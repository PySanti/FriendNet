# Generated by Django 4.2.1 on 2023-07-15 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Usuarios', '0021_alter_usuarios_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuarios',
            name='photo_link',
            field=models.CharField(max_length=85, null=True),
        ),
    ]
