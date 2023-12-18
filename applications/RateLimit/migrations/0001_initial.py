# Generated by Django 4.2.1 on 2023-12-18 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RateLimitInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip', models.CharField(unique=True)),
                ('banned', models.BooleanField(default=False)),
                ('suspended', models.DateTimeField(default=None)),
                ('calls_in_cut', models.PositiveSmallIntegerField(default=0)),
                ('last_cut_time', models.DateTimeField(auto_now_add=True)),
                ('strikes', models.PositiveSmallIntegerField(default=1)),
            ],
        ),
    ]
