# Generated by Django 4.2.1 on 2023-06-14 17:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Notifications', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notifications',
            name='msg',
            field=models.CharField(max_length=50),
        ),
    ]
