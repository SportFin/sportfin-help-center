---
categories: ["Devops"]
tags: ["docs", "logging"]
title: "Logging"
linkTitle: "Logging"
date: 2023-02-07
description: >
  How to view logs pr-previews
---

{{% pageinfo %}}
  When debuging, you need logs. This is how to view container and server logs.
{{% /pageinfo %}}

# View pr-preview Container Logs

## Access to container logs via web-based UI (Grafana)

As a developer I want to be able to see error logs (container logs) of
pr-previews so that I can investigate errors more easily by seeing the logs.

> How do I check the logs of a pr-preview contaienr which is having an error, how do I view the logs?

We have grafana set-up to view the logs of the containers for pr-previews (and soon production too, same process)

1. [Open grafana to view container logs for a pr-preview](https://logs.sportfin.io/explore?orgId=1&left=%7B%22datasource%22:%22P8E80F9AEF21F6940%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22datasource%22:%7B%22type%22:%22loki%22,%22uid%22:%22P8E80F9AEF21F6940%22%7D%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D)
2. Click `Seclect label` below "Label filters" and choose the container name\* you want to view the logs for
3. Click "Run query", and logs (if any) will be shown for that container
4. You can also click "Live" to get live updated logs

[Video how to access logs](https://youtu.be/sexWnPc4NQo)


> Please note logs are not instant, they refresh ~every 15 secconds


##### PR-Preview view basic container metrics
You can also see basic container metrics (such as ram usage / disk consumed)
at: [pr-preview container basic metrics](https://logs.sportfin.io/d/ENOuORaGz/docker-and-system-monitoring?orgId=1&refresh=5m)


## Access to raw server logs directly

If you have ssh access to the server:

1. login to the server with `ssh <username>@<ip-address>`
2. `docker ps`
3. View the logs of the container: `docker logs -f <container-id>` see [docker logs docs](https://docs.docker.com/engine/reference/commandline/logs/)


