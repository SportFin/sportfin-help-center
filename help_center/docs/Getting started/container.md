---
categories: ["Devops"]
tags: ["docs", "container"]
title: "Container"
linkTitle: "Sportfin Container"
date: 2023-02-07
description: >
  How to build & run the Sportfin container
---

{{% pageinfo %}}
 You probably *don't* want/need to login to the registry for most local development
  because you already have the container definition `Dockerfile` referenced in `docker-commpose.yaml`
  and will want to use that, because that's the true latest version. See 'Getting started' in these docs.

{{% /pageinfo %}}

# Where is the Sportfin container hosted?

In the GitHub packages registry: [https://github.com/SportFin/sportfin/pkgs/container/sportfin%2Fsportfin](https://github.com/SportFin/sportfin/pkgs/container/sportfin%2Fsportfin)

# How do I connect to GitHub container registry (`ghcr`)?



1. With the `read:packages` permission only, [create a **classic** personal access token](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) ([shortcut](https://github.com/settings/tokens))
  > You only need the `read:packages` permission to pull images

2. Login to the Github container registry

  ```
  export CR_PAT=<replace-with-your-personal-access-token>
  echo $CR_PAT | docker login ghcr.io -u chrisjsimpson --password-stdin
  ```
3. Now you can pull the latest Sportfin container

  ```
  docker pull ghcr.io/sportfin/sportfin/sportfin:latest
  ```
