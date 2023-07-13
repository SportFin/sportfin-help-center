---
title: "Clubs"
linkTitle: "Clubs"
weight: 4
description: >
  Understanding the Club model and its use-cases.
---

{{% pageinfo %}}
This page will give you an overview of our [`Club` Model](https://github.com/SportFin/sportfin/blob/43be6fbc173eb2252de1836488b265f7d2abb259/clubs/models.py#L119). 
{{% /pageinfo %}}

Every sport organisation on SportFin is a `Club` model.

A `Club` can have the following 'main' assets associated to it:
- [`ClubUser`](https://github.com/SportFin/sportfin/blob/cff4012b99041bc2c053861eb832fd001eecb42d/clubs/models.py#L500): a joining table to link `SportFinUser` to `Club`.
- [`ClubActivity`](https://github.com/SportFin/sportfin/blob/cff4012b99041bc2c053861eb832fd001eecb42d/clubs/models.py#L524): describes activities delivered by a `Club`.
- [`ClubFacility`](https://github.com/SportFin/sportfin/blob/cff4012b99041bc2c053861eb832fd001eecb42d/clubs/models.py#L510): describes facilities where activities are delivered by `Club`.
