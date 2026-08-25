---
title: Property Management Platform
slug: property-management
track: production
role: Backend engineer — 2-person team, delivered for Nesin Foundation
period: Dec 2023 — Feb 2025
summary: A Django platform managing 100+ property listings for a Turkish mathematics education non-profit, covering rent, expense and tenant workflows with a reporting layer over a normalised PostgreSQL schema.
stack:
  - Python
  - Django
  - PostgreSQL
  - REST APIs
  - AWS (EC2, S3)
  - CI/CD
domains:
  - backend
  - data-engineering
metrics:
  - { label: Property listings, value: '100+' }
  - { label: Normalised tables, value: '15+' }
  - { label: Dashboard load time, value: '-60%' }
links:
  github: null
  demo: null
featured: true
confidential: false
order: 95
---

## The problem

Nesin Foundation funds mathematics education in Turkey, partly from rental
income across a portfolio of properties. That portfolio was being tracked in
spreadsheets: rent due dates, tenant records, maintenance expenses and the
monthly reconciliation that ties them together. The failure mode is quiet — a
missed renewal or an unrecorded expense simply does not surface.

## Constraints

Two engineers, and a client whose alternative was the spreadsheets they already
had. That sets a hard bar: a system that is merely correct loses to a
spreadsheet that is familiar. It had to be faster for the person doing the
monthly reconciliation on the first day, not the first quarter.

## What made it hard

Reconciliation is where the money is and where the modelling is hardest. Rent
due, rent received, an expense against a property, and the month they all belong
to are four separate facts that arrive at four different times and are entered
by people who think of them as one event. A schema that assumes they arrive
together produces a system that cannot record reality, and one that assumes
nothing produces a system nobody can report from.

## Decisions

**A normalised schema over a spreadsheet-shaped one.** Fifteen-plus tables where
the client's mental model was a handful of sheets. It costs more up front and in
explanation, and it is the only version where "which expenses hit this property
last year" is a query rather than an archaeology exercise.

**Django, for the same reason as the schema.** A two-person team needed the
admin, the ORM and the migrations to come with the framework rather than be
built. The trade is that the ORM decides the query shape until you take it back
by hand — which, as below, is exactly what happened at the reporting layer.

**Query and index work before a reporting model.** When the dashboard slowed,
the choice was a modelled reporting layer or making the existing queries and
indexes match how the screen actually reads. The second is smaller, reversible,
and sufficient at this size — and it is a deferral, not a fix.

## Architecture

A Django backend over a PostgreSQL schema of 15+ normalised tables, modelling
properties, tenancies, payment schedules, expense categories and the
reconciliation between them. Deployed on AWS with CI/CD.

## What I built

Backend architecture and implementation, the database schema, the reporting
endpoints and the deployment pipeline — from requirements analysis through to
production, as one of a two-person team.

## Impact

The reporting dashboard was the slowest surface in the system, because it
aggregated across the full history on every load. Query restructuring and a
considered indexing strategy cut its load time by 60%.

That figure is dashboard load time, before and after the query and indexing
work, on the same portfolio — roughly a hundred property listings. It is a
measurement of one screen, not of the system: nothing else in the application
was slow enough to be worth measuring.

## Where it is going

The platform runs on Django in production. I am currently rebuilding the backend
on .NET, mainly for the reporting path — the aggregations are the part that
strains first, and a typed, compiled query layer gives more room to optimise
them than the ORM does at this shape.

That rewrite is in progress; the Django version is the one serving real users.

## What I'd change

The reporting layer reads straight from the transactional schema. That is the
right starting point at this size, but the aggregations are the part that will
strain first — a materialised reporting view, refreshed on write, would take the
pressure off before it becomes a problem. It is the main thing driving the .NET
rebuild above.
