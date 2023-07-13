---
title: "Individuals"
linkTitle: "Individuals"
weight: 4
description: >
  Understanding the SportFinUser model and its use-cases.
---

{{% pageinfo %}}
This page will give you an overview of our main User Model: [SportFinUser](https://github.com/SportFin/sportfin/blob/43be6fbc173eb2252de1836488b265f7d2abb259/sportfin/models.py#L534). 
{{% /pageinfo %}}

Every user on SportFin is an instance of the `SportFinUser` model. 

Described below is the use cases and main relationships a `SportFinUser` might have on SportFin.
* **A sport participant/member**: A sport participant participates in sport at a `Club`(read more about the `Club` model [here](/docs/Concepts/Users/clubs.md)). The [`ClubUser`model](https://github.com/SportFin/sportfin/blob/43be6fbc173eb2252de1836488b265f7d2abb259/clubs/models.py#L500) joins a `SportFinUser` instance and a `Club` instance.
* **A club administrator**: A club administrator is a `ClubUser` that has `is_admin` variable as True.
* **A club staff**: A club staff is a `ClubUser` that has `is_staff` variable as True.
* **A sport volunteer**: A sport volunteer if a `ClubUser` that has the has `is_staff` and `is_volun` variables as True.
* **An individual funder**: An individual funder is a `SportFinUser` that has funded a `Club`, and is defined by the [`ClubIndividualFunders`](https://github.com/SportFin/sportfin/blob/3decea7cffcbc1044faa998b20881b704f422b9d/clubs/models.py#L1077) model.
* **An institutional funder/governing body administrator**: An institution is a Sport Funder or Governing Body that has an interest in accessing sport and social impact analytics on SportFin, or is interested in funding a `Club` through SportFin (read more [here](/docs/Concepts/Users/institutions.md)). `SportFinUser` instances are joined to an `Institution` by the `InstitutionUser` model. If an `InstitutionUser.is_admin` is True, they are an intitutional administrator. 
* **An institutional funder/governing body staff**: If an `InstitutionUser.is_staff` is True, they are an intitutional staff. 
