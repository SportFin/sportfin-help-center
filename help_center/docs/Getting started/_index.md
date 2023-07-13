---
categories: ["Examples", "Placeholders"]
tags: ["test","docs"] 
title: "Getting Started"
linkTitle: "Getting Started"
weight: 2
description: >
  Sportfin development guide
---

## Prerequisites

{{% pageinfo %}}
  - Read branching
  - For local development, container based development is recommended using Docker/podman.
  
  Setup instructions for both Docker, and without Docker are below
{{% /pageinfo %}}


Download & Install:

* Python3
* Git
* [Docker compose](https://docs.docker.com/compose/install/)

# Local development (with Docker)


```
git clone git@github.com:SportFin/sportfin.git
cd sportfin
cp .env.example .env
docker build -t sportfin .
docker-compose up

# Wait until the database has been populated to run the command (around 30seconds)
docker exec -it sportfin python3 manage.py createsuperuser
```

Now visit [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Database seeding

It's no fun developing with an empty database. Use these steps to
populate the database.

> WIP Issue to create fake data https://github.com/SportFin/sportfin/issues/344
  in the meantime, follow the steps below

### Import dev dataset into your local environment

1. Ensure you have sportfin running locally already
2. Import the test development dataset into your local database:

```
cat dump.sql | podman exec -i sportfin-db psql -U postgres -d postgres
```

After the database has been imported, view the database locally using dbgate at [http://127.0.0.1:3000/](http://127.0.0.1:3000/).

Note you'll probably want to [re-setup a superuser](#setup-admin-user) unless you know a login already.

<hr />

# Local develop (without Docker)

### Local development (without docker)

> Note if you're using the docker based approach the below is not needed.

#### 1. Create python virtual environment
```
python3 -m venv venv
```

#### 2. Activate virtual environment (always)

```
source venv/bin/activate
```

#### 3. Clone &amp; Install requirements


```
git clone git@github.com:SportFin/sportfin.git
cd sportfin
cp .env.example .env
. ./venv/bin/activate
pip install -r requirements.txt
```

> You may need to install `libpq-dev` 
  ```
  apt install libpq-dev
  ```

Run the application:

```
python3 manage.py runserver 0.0.0.0:8000
```

Now visit [http://127.0.0.1:8000](http://127.0.0.1:8000)



## Setup admin user

Superuser may be created with the following credentials: </br>
user: admin@example.com</br>
pass: password </br>

See [`./create_superuser.sh`](https://github.com/SportFin/sportfin/blob/main/create_superuser.sh) for details.

Manually: With sportfin running, manually create a new superuser

### Setup superuser when running via docker-compose:

```
docker-compose exec -T sportfin bash <./create_superuser.sh
```

Or manually:

```
# Exec into sportfin container
docker-compose exec sportfin bash

# Create super user
python3 manage.py createsuperuser
````


