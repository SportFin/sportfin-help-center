---
categories: ["email"]
tags: ["docs", "email"]
title: "Email"
linkTitle: "Email"
date: 2023-02-07
description: >
  How to config/test email sending
---

{{% pageinfo %}}
  How to config/test email sending
{{% /pageinfo %}}

> Note we also run a basic 'check email sending is working*' every day at 8am
> A see the [Email test pipeline](https://github.com/SportFin/sportfin/actions/workflows/email-sending.yml)
> <br />*working only means that the credentials are correct, and django can `send_email`. See Playwright tests for
> full integration tests which may send email as a side effect.

# How to send email / validate email settings

For 'real' `SMTP` email sending from your local machine, you'll need the following secrets:

- EMAIL_HOST_USER
- EMAIL_HOST_PASSWORD

Ask for those secrets from the password manager.

Note you don't have to use `SMTP`, you can avoid `SMTP` and send email to your terminal instead by setting
[EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend](https://github.com/SportFin/sportfin/blob/1c300512747b1495e29eb220414bcf85f73bb6d6/.env.example#L17)

1. Check your `.env` settings (`cp .env.example .env`)
2. Use the test send email script (or read [Django email docs](https://docs.djangoproject.com/en/4.1/topics/email/))

```
cat send_email_test.py | python3 manage.py shell
```
