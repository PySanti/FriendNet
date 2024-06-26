# Generated by Django 4.2.1 on 2023-06-04 22:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Messages',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parent_id', models.PositiveIntegerField()),
                ('content', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.PositiveSmallIntegerField()),
                ('messages', models.ManyToManyField(to='Chats.messages')),
            ],
        ),
    ]
