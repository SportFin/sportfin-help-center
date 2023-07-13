---
categories: ["branching"]
tags: ["docs", "branching", "sdlc", "trunk-based-development"]
title: "Branching"
linkTitle: "Branching"
date: 2023-02-07
description: >
  Branching , trunk based development
---

{{% pageinfo %}}
  **tldr**:
  - Always start with [creating an issue](https://github.com/SportFin/sportfin/issues/new/choose).
  - Always branch off of the `main` branch (also known as `trunk`)
  - Branches are created based on <issue-number>-<issue-title>
  - Branches are [created automatically using that naming scheme for you](https://github.com/SportFin/sportfin/actions/workflows/git-auto-issue-branch-creation.yml) when an issue is created
    - If that fails, create one yourslef (`git checkout-b <issue-number>-<title>`)
  - **regularly** keep your issue branch up-to-date with `main`, by `git fetch`'ing and `git pull origin main` to apply changes from your fellow developers which may have alreayd been merged into `main` whilst you were working on another branch.
  
{{% /pageinfo %}}

Read more: [Trunk based development](https://minimumcd.org/minimumcd/#trunk-based-development)
