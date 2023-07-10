---
categories: ["Devops"]
tags: ["docs", "FAQ", "operations", "faq"]
title: "FAQ"
linkTitle: "FAQ"
date: 2023-02-07
description: >
  Operations FAQ
---

{{% pageinfo %}}
  Operations FAQ for operational confidence
  written to address [https://github.com/SportFin/sportfin/issues/470](https://github.com/SportFin/sportfin/issues/470), as with all docs please update as you go and err on the side providing command examples over only theory.
{{% /pageinfo %}}

# FAQ

## How do I restore the database?
  See [Backups]({{< ref "/docs/operations/backups" >}})

## What do I do if a/the server has crashed?

- Assess &amp; document
  - What's the observable behavour?
  - What happened leading up to the issue
- Consider if restarting the server instance in [ec2](https://eu-west-2.console.aws.amazon.com/ec2/home?region=eu-west-2#Instances:v=3;$case=tags:true%5C,client:false;$regex=tags:false%5C,client:false) is an appropriate action to take
- Document a postmortem
- Apply fixes to prevent same issue happening again
- Verify actions (especially "Smoke test" if production) to check everything is back online [see actions](https://github.com/SportFin/sportfin/actions)

> Note: During a server reboot you won't be able to `ssh` into the machine and any websites / apps hosted will be offline.

## How do you handle out of disk space?

When disk space runs out it's tempting to simply add more disk space.
Whilst that may be needed- first assess the cause of the disk space.

- Are there logs which need rotating?
- Is the system full from docker containers not being cleaned up?

### Example system out of disk space:

In this exanple, a self-hosted Github actions runner is out of disk space, and has therefore stopped processing pipelines (aka Github actions)

1. Asess

> Note the: `System.IO.IOException: No space left on device`

```
ssh <username>@<runner-ip>
2023-03-23 19:04:58Z: Running job: Check public urls OK
Unhandled exception. System.IO.IOException: No space left on device : '/root/actions-runner/_diag/Runner_20230323-013616-utc.log'
   at System.IO.RandomAccess.WriteAtOffset(SafeFileHandle handle, ReadOnlySpan`1 buffer, Int64 fileOffset)
   at System.IO.Strategies.BufferedFileStreamStrategy.FlushWrite()
   at System.IO.StreamWriter.Flush(Boolean flushStream, Boolean flushEncoder)
   at System.Diagnostics.TextWriterTraceListener.Flush()
   at GitHub.Runner.Common.HostTraceListener.WriteHeader(String source, TraceEventType eventType, Int32 id)
   at GitHub.Runner.Common.HostTraceListener.TraceEvent(TraceEventCache eventCache, String source, TraceEventType eventType, Int32 id, String message)
   at System.Diagnostics.TraceSource.TraceEvent(TraceEventType eventType, Int32 id, String message)
   at GitHub.Runner.Common.Tracing.Error(String message)
   at GitHub.Runner.Common.Terminal.WriteError(String line)
   at GitHub.Runner.Listener.Program.MainAsync(IHostContext context, String[] args)
   at GitHub.Runner.Listener.Program.Main(String[] args)
/root/actions-runner/run-helper.sh: line 36: 129731 Aborted                 (core dumped) "$DIR"/bin/Runner.Listener run $*
Exiting with unknown error code: 134
Exiting runner...
root@github-runner-a:~/actions-runner# 
```

2. Verify: check disk space

> Note available: 0

```
github-runner-a:~/actions-runner# df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        19G   19G     0 100% /
```

3. Since runners use containers to run, check if `docker system prune` creates enough free space

```
docker system prune
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - all dangling build cache

Are you sure you want to continue? [y/N] y
```

4. Observe disk space recovered:

```
...
ecs4yierp5pkbr6ozd79c4fsx
usprg48akdcmh4to7onhe6fem
7lcq5x5gn4cqph47flnrif0ij
01ccx352tk72aaea7qbf4s5l1

Total reclaimed space: 9.434GB
```

5. Verify: check disk space again

```
github-runner-a:~/actions-runner# df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        19G  9.0G  8.7G  51% /
```

6. Re-start runner


```
RUNNER_ALLOW_RUNASROOT="0" ./run.sh
```

Verify runner is OK:

```
github-runner-a:~/actions-runner# !1
RUNNER_ALLOW_RUNASROOT="0" ./run.sh

√ Connected to GitHub

Current runner version: '2.303.0'
2023-03-27 13:46:03Z: Listening for Jobs
2023-03-27 13:46:06Z: Running job: Check public urls OK
2023-03-27 13:46:15Z: Job Check public urls OK completed with result: Succeeded
```

6. Automate

[Automatically clear disk space for self hosted runner Github Actions](https://github.com/SportFin/sportfin/issues/481)

#### How do I check disk space?

```
# Checks root (/) disk space
du -sh /

# Checks all filesystems disk space
du -sh 
```

#### Clean up docker storage

This will tell docker to remove unused / dangling containers no longer being used:

```
docker system prune
```

## How do you upgrade the EC2 instance (aka How do I change the instance type)

Upgrading the server type simply means buying more server resources (RAM, CPU , [IOps](https://en.wikipedia.org/wiki/IOPS)

Before upgrading, ask

- Why is resource usage high?
- Why are we doing this, is there actually a bug using too much resource

Just like disk space, it's tempting to simply add more resources (aka spend more money) by thowing resources (money) at the issue. Whilst that may be needed- first assess the cause of the high resource usage. 

{{% alert title="Perspective on resources and scale- did you know?" %}}

"In **1999** one of the busiest ftp sites, cdrom.com, actually handled 10000 clients simultaneously through a Gigabit Ethernet pipe." - [The C10K problem](http://www.kegel.com/c10k.html)

{{% /alert %}}


OK but how do I upgrade the server instance? See [AWS Change the instance type](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-resize.html)



## How does DNS work- how do I update a DNS record?

> Issues can be confused (especially support) following a DNS change because DNS changes *take time* to come into affect for different computers depending where they are, and how they're configured.

- Changes to DNS records are made at the nameserver, at time of writing the nameserver product is ["Route 53"](https://us-east-1.console.aws.amazon.com/route53/home?region=eu-west-2#)


- [What happens when you update your DNS?](https://jvns.ca/blog/how-updating-dns-works/)
- `did` command is your friend for troubleshooting DNS [How to use dig](https://jvns.ca/blog/2021/12/04/how-to-use-dig/)
- Julia Evans [resources on DNS](https://jvns.ca/categories/dns/)



