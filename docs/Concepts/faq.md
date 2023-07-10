---
categories: ["Database", "Querying"]
tags: ["docs", "FAQ", "database", "querying", "faq"]
title: "FAQ"
linkTitle: "FAQ"
date: 2023-02-07
description: >
  Operations FAQ
---

{{% pageinfo %}}
  Querying FAQ for development confidence
  written to address [https://github.com/SportFin/sportfin/issues/544](https://github.com/SportFin/sportfin/issues/544), as with all docs please update as you go and err on the side providing command examples over only theory.
{{% /pageinfo %}}

# FAQ
Prerequisites:
- See [http://docs.sportfin.io/docs/concepts/models/models/](http://docs.sportfin.io/docs/concepts/models/models/).
- Read the Django Queryset API docs: https://docs.djangoproject.com/en/4.1/ref/models/querysets/

> Note: these are illustrative examples.

# How to get a SportfinUser from a ClubUser
The `ClubUser` model has a `user` variable that links to a `SportFinUser` object through a `ForeignKey`. You can use the Django ORM to directly access and query `SportFinUser` variables through `user__{variable}`.

# How to get all members of a club
The `Club` model has a `members` property ([ref](https://github.com/SportFin/sportfin/blob/261228e266f975cd9b38afd68285e63bce7df28e/clubs/models.py#L340-L348)), so you can access members via `Club.members`. Similar properties exist for `staff` and `admin`, see `Club` properties from [here](https://github.com/SportFin/sportfin/blob/261228e266f975cd9b38afd68285e63bce7df28e/clubs/models.py#L186).

# How to get all members checked-in to one activity
Currently the best way to do this is to use the `Club` objects `all_check_ins` property and filter it by `activity_instance` or `activity_instance__activity`.
e.g.
```
club = Club()
activity = ClubActivity()
instance = ActivityInstance()
#get check-ins of activity
activity_check_ins = club.all_check_ins.filter(activity_instance__activity=activity)
#get check-ins of instance
instance_check_ins = club.all_check_ins.filter(activity_instance=instance)
```
> Note: Might be worth adding a property to the `ClubActivity` and `ActivityInstance` models so the above can be accessed easily.

# How to get all members registered for an activity
All registrations are stored in the `ClubActivityMember` model. To get registrations for an `ActivityInstance` or `ClubActivity`, filter the `ClubActivityMember` model accordingly.
e.g.
```
activity = ClubActivity()
instance = ActivityInstance()
#For activity
registrations = ClubActivityMember.objects.filter(activity_instance__activity=activity)
#For instance
registrations = ClubActivityMember.objects.filter(activity_instance=instance)
```
> Note: Might be worth adding a property to the `ClubActivity` and `ActivityInstance` models so the above can be accessed easily.

# How to get all clubs funded by a specific funder?
Funding transactions are tracked by the `ClubIndividualFunders`([ref](https://github.com/SportFin/sportfin/blob/main/clubs/models.py#L1191)) and `ClubInstitutionalFunders`([ref](https://github.com/SportFin/sportfin/blob/main/clubs/models.py#L1203)) models.

If funder is a Individual, get clubs funded by:
```
funder = SportFinUser()
clubs = Club.objects.filter(pk__in=ClubIndividualFunders.objects.filter(funder=funder))
```
If funder is a Institution, get clubs funded by:
```
funder = Institution()
clubs = Club.objects.filter(pk__in=ClubInstitutionalFunders.objects.filter(funder=funder))
```
> Note: Might be worth adding a property to the `ClubActivity` and `ActivityInstance` models so the above can be accessed easily.

# How to get club/clubs of a SportFinUser?
`SportFinUser` model has properties defined for this. You can use `SportFinUser.clubs` to get all active `Club` objects of that `SportFinUser`. You can also use `clubs_member`, `clubs_staff` and `clubs_admin` properties to get a Queryset of `Club` objects where the `SportFinUser` is a member, staff or admin respectively ([ref](https://github.com/SportFin/sportfin/blob/261228e266f975cd9b38afd68285e63bce7df28e/sportfin/models.py#L730-L772)). 

See all `SportFinUser` properties from [here](https://github.com/SportFin/sportfin/blob/261228e266f975cd9b38afd68285e63bce7df28e/sportfin/models.py#L616)