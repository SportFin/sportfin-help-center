---
categories: ["Devops"]
tags: ["docs", "pipelines", "actions", "runners", "automation", "testing"]
title: "Pipelines"
linkTitle: "Pipelines"
date: 2023-02-07
description: >
  Pipelines & Runners via Github Actions
---

{{% pageinfo %}}
  The [GitHub action pipelines](https://github.com/SportFin/sportfin/actions) and runners which support
  release & test automation. The runners (self hosted runners and GitHub hosted runners).
{{% /pageinfo %}}


# Overview

Our pipelines (such as pr-preview and deploy) run via [GitHub action pipelines](https://github.com/SportFin/sportfin/actions).

Those pipelines run/execute on either

1. Github owned servers (up to 2000 mins)
2. Self hosted runners (to save costs)

> When Github actions uses 2000 minutes, actions wants more money 💸 however that's quite expensive.
  [self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners) don't
  contibute to the 2000 min limit, so we can switch to self-hosted runner(s) as and when needed.

# How to switch between Github runners

You may want to switch back/forth between using github hosted runners (expensive) and 
self hosted runners (potentially less capacity/down).

Either way, you can easily convert all pipelines (aka GitHub actions) to use self hosted runners or
GitHub owned runners:

1. Go into the sportfin repo root directory.
2. Run either `./operations/switch-to-self-hosted-runners.sh` or `./operations/switch-to-github-hosted-runners.sh`
3. Commit & push

example:
```
# 1. make sure in project root
ls
activities              ciscalculations      Dockerfile.docs          fix-env          Procfile           seed.py
..etc

# 2. Switch to github-hosted runners
./operations/switch-to-github-hosted-runners.sh

# 3. git diff & review

git diff
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   .github/workflows/build-container.yml
	modified:   .github/workflows/deploy-latest.yml
	modified:   .github/workflows/docs.yml
	modified:   .github/workflows/pr-preview.yml
	modified:   .github/workflows/prod-deploy.yml
	modified:   .github/workflows/prod-smoketest.yml
	modified:   .github/workflows/release.yml
	modified:   .github/workflows/test.yml

# 4. Commit & push

git commit -am 'switched to github hosted runners'

```

After performing the above, all `runs-on` will be updated and the [Github actions](https://github.com/SportFin/sportfin/actions)
will run on the chosen runners.


> Note: The above will likey be added as a github action to remove the manual steps, the manual steps are here for use and fallback.
