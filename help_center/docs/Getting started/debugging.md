---
categories: ["debugging"]
tags: ["docs", "container"]
title: "Debugging"
linkTitle: "Debugging"
date: 2023-02-07
description: >
  Debugging , breakpoints, debugger etc
---

{{% pageinfo %}}
  How to access the [`breakpoint()` / `pdb` debugging](https://docs.python.org/3/library/pdb.html) from host -> container
{{% /pageinfo %}}


When *not* running python within a container you can simply write
`breakpoint()` anywhere in your code, and python will pause (`break`) at
that point in time.

In a container, you need to ask docker to `attach` to the container, and 
the container (can't? I'm not sure) tell your host that a breakpoint has happened- you need to use `docker attach APP_NAME`.

## Example using `breakpoint()` inside container code and attaching to that
#

How do I turn on the debugger?

1. Enable a breakpoint by adding breakpoint() to your code
2. Sart your application (often `docker-compose up` and run to that point then in a terminal type:

```
docker attach sportfin
```

When python hits your `breakpoint()` then the python debugger will start- press enter if you don't see it.
