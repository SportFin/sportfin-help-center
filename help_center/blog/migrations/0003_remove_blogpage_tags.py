# Generated by Django 4.1.8 on 2023-04-24 09:39

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("blog", "0002_blogpage_tags"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="blogpage",
            name="tags",
        ),
    ]
