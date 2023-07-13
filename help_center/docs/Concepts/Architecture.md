---
categories: ["concepts"]
tags: ["architecture", "database", "sql", "models"]
title: "Architecture"
linkTitle: "Architecture"
date: 2017-01-05
description: >
---


# Bird’s eye overview of the problem being solved

The purpose of Sportfin is to measure impact from doing Sports activities 
and collecting evidence of activities performed to calculate potential outcomes.

# Codemap

- `sportfinapi` is the main module of Sportfin.
- Note that database migrations are stored in the `sportfin` folder not `sportfinapi`

# Images Static Assets 

- `clubs/static/img`

Django `collectstatic` makes a folder `static` in the root directory, and collects all the various module images into one static folder ([see Django Docs collectstatic](https://docs.djangoproject.com/en/4.1/howto/static-files/)).

# Settings

 - The settings file is inside: sportfinapi/settings.py

# Database Model (tables & migrations)

- The Database model is inside: sportfin/models.py

- Django Additional Custom Commands
Django has many built-in commands (e.g. python manage.py runserver), however Sportfin has additional commands in `sportfinapi/management/commands`.

- Elastic Beanstalk
  - See folder 
  - .ebextensions
  - .platform/hooks
