---
categories: ["concepts"]
tags: ["celery", "background", "email", "scheduled"]
title: "Celery"
linkTitle: "Celery"
date: 2023-04-04
description: How does celery work on SportFin>
---

See https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html

# Where is the code:
All the celery code is in the `sportfinapi` app.

Supervisor starts the celery tasks: https://github.com/SportFin/sportfin/blob/main/supervisord.conf

Initial configuration is in [`celery.py`](https://github.com/SportFin/sportfin/blob/main/sportfinapi/celery.py). 

Celery settings are in [`sportfinapi.settings.py`](https://github.com/SportFin/sportfin/blob/7490dafd8bf6272433fe65de6629dd00fdd9b37a/sportfinapi/settings.py#L170-L171)

Celery tasks are in [`sportfinapi.tasks.py`](https://github.com/SportFin/sportfin/blob/main/sportfinapi/tasks.py)
