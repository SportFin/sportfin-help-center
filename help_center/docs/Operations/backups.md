---
categories: ["Devops"]
tags: ["docs", "backups", "iam", "roles", "policy", "ec2"]
title: "Backups"
linkTitle: "Backups"
date: 2023-02-07
description: >
  Backups: where backups, what backups, how backups, why how backups.
---

{{% pageinfo %}}
  The current state of backups 
  (where backups, what backups, how backups, why how backups)
{{% /pageinfo %}}

# Where are the backups?

- 'The backups' may refer to:
  - Production database backups
  - PR-Preview database backups
  - Infrastructure/config backups


## Database backup location

Database backups are generally stored in the object store called `s3` on AWS.

### Prod instance database backups

> `prod` ec2 instance (not to be confused with `Sportfin-prod-2`)

Link to `prod` backups: https://s3.console.aws.amazon.com/s3/buckets/sportfin-prod-database-backups?region=eu-west-2&tab=objects


# How is database backup performed?

- Automated
- Manually

## `prod` Automated database backups

View the current `prod` database backup schedule by:

```
dokku postgres:backup-schedule-cat prod
```

Output:

```
ssh prod-sportfin dokku postgres:backup-schedule-cat prod
30 14 * * * dokku /usr/bin/dokku postgres:backup prod sportfin-prod-database-backups --use-iam
```

The output above shows the `prod` database schedule set to 14:30 every day at time of writing.



## `prod` manual database backup

How to take a manual database backup:

```
dokku postgres:backup prod sportfin-prod-database-backups --use-iam
```

# How to restore a database backup?

Example:

```
dokku postgres:import <name-of-app> < data.dump
```

Where name of app is very carefully chosen, for example `testapp`, checked, and then if OK, replaced with `prod`.

See details: [Data Management](https://github.com/dokku/dokku-postgres#data-management)


# How are automated database backups configured? (aim, aws, permissions)

The [sportfin `prod` instance](https://eu-west-2.console.aws.amazon.com/ec2/home?region=eu-west-2#Instances:v=3;$case=tags:true%5C,client:false;$regex=tags:false%5C,client:false;sort=tag:Name) has an [AWS IAM Role attached called `sportfin-prod-database-backups-ec2-s3-access`](https://eu-west-2.console.aws.amazon.com/iam/home?region=us-east-1#roles/sportfin-prod-database-backups-ec2-s3-access) which has a [policy attacked called `polocy-sportfin-prod-database-backups-s3-write`](https://us-east-1.console.aws.amazon.com/iam/home#/policies/arn:aws:iam::963311879454:policy/polocy-sportfin-prod-database-backups-s3-write) which given the server permission to write to only the S3 bucket [sportfin-prod-database-backups](https://s3.console.aws.amazon.com/s3/buckets/sportfin-prod-database-backups?region=eu-west-2&tab=objects)


# Example: Delete and restore the database in production

{{< alert color="warning" title="Warning" >}}These steps will delete the database to show the process of restoring from a backup in production.{{< /alert >}}

### **Contrived Scenario:** All users are deleted (droped) from the database by accident:

Here we will delete/drop all users from the database of https://live.sportfin.io/

Deletion of all users.

{{< alert color="warning" title="Warning" >}}These steps will delete all users from the prod database.{{< /alert >}}


1. Login to prod server (`ssh`)
1. Perform an ad-hoc prod database backup `./backup-prod-db.sh`
1. Verify [prod database backups](https://s3.console.aws.amazon.com/s3/buckets/sportfin-prod-database-backups?region=eu-west-2&tab=objects)
3. Verify conectivity to database: `docker exec -it -u postgres dokku.postgres.prod psql -d prod -c 'SELECT COUNT(*) FROM sportfin_sportfinuser'`
   The above command execs into the container named `dokku.postgres.prod`, as user `postgres`, connects to the database (`-d`) `prod`, and performs
   a count of all rows in the `sportfin_sportfinuser` table.
4. **Caution** Delete users from the database: Remove the `#` if you know what you're doing.
   ```
   ##docker exec -it -u postgres dokku.postgres.prod psql -d prod -c 'SET session_replication_role = 'replica'; DELETE FROM sportfin_sportfinuser'
   ```
5. Verify User records deleted:
   ```
   docker exec -it -u postgres dokku.postgres.prod psql -d prod -c 'SELECT COUNT(*) FROM sportfin_sportfinuser'
   count 
   -------
        0
   (1 row)
   ```
6. (optional) Verify you can no-longer login

### **Action:** Restoring the prod database from backup:


{{< alert title="Note" >}}Realise that automated backups *continue* to be attempted. Be sure that you don't try to restore a database backup which was taken *after* the incident.{{< /alert >}}

1. (recommended) Put prod into maintenance mode to prevent new data being added to the database:
   ```
   dokku maintenance:enable prod
   ```
1. Locate and decide which backup to restore from the backups in S3 (see "Where are the backups" on this page)
2. Download the backup (e.g. `postgres-prod-2023-04-03-11-00-04.tgz`)
3. If approprioate, copy the backup to the prod server using `scp` or similar
   ```
   scp ~/Downloads/postgres-prod-2023-04-03-11-00-04.tgz prod-sportfin:~/
   ```
4. Restore the database to the `dokku.postgres.prod` `prod` app
   ```
   # Connect to prod
   ssh prod-sportfin
   # Become root
   sudo -i
   # Move backup to /root
   mv /home/ubuntu/postgres-prod-2023-04-03-11-00-04.tgz /root/
   ```
   Extract the backup:
   ```
   tar -xvf postgres-prod-2023-04-03-11-00-04.tgz
   ls -ltr
   ```
   Perform the restore:
   ```
   dokku postgres:import prod < backup/export
   # wait for restore to complete...
   ```
5. Verify restore was OK:
   ```
   docker exec -it -u postgres dokku.postgres.prod psql -d prod -c 'SELECT COUNT(*) FROM sportfin_sportfinuser'
    count 
   -------
      562
   (1 row)
   ```
6. Disable maintenance mode:
   ```
   dokku maintenance:disable prod
   ```
7. Verify login is OK
