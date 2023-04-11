# Generated by Django 4.2 on 2023-04-10 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('atm_api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='accountholder',
            name='userName',
        ),
        migrations.AddField(
            model_name='accountholder',
            name='fingerprintID',
            field=models.IntegerField(default=1, max_length=3),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='accountholder',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
