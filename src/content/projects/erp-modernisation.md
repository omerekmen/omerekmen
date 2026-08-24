---
title: ERP Accounting & Purchasing Modernisation
slug: erp-modernisation
track: production
role: Software engineer — working student, ERP team of 3–4 (sole engineer for two months)
period: Jun 2024 — May 2026
summary: The accounting and purchasing modules of a Koç Group ERP, rebuilt from .NET Framework onto .NET 8/9 microservices while they stayed in production — with the manual steps between them automated away.
stack:
  - .NET 8
  - ASP.NET Core
  - Entity Framework Core
  - MediatR/CQRS
  - SQL Server
  - T-SQL
  - SSIS
  - SSRS
  - RabbitMQ
  - Redis
  - Docker
  - Kubernetes
  - Azure DevOps
domains:
  - backend
  - data-engineering
metrics:
  - { label: Expense processing time, value: '-70%' }
  - { label: Accounting process time, value: '-30%' }
  - { label: Stored procedures, value: '50+' }
  - { label: SSRS reports, value: '15+' }
links:
  github: null
  demo: null
featured: true
confidential: false
order: 98
---

## The problem

Otokoç Otomotiv runs its accounting and purchasing through an ERP that people
use all day. Two things were wrong with it at once, and they pulled in opposite
directions.

The screens asked people to make decisions a rule could make. An expense claim
for a business trip would be typed in one system, checked by hand against
another, and approved by someone reading both. Every one of those steps was a
place to be slow or to be wrong.

Underneath, the platform was a .NET Framework monolith. Changing anything meant
risking everything, which is exactly the condition that makes a team stop
improving the screens in the first place.

## What I built

The accounting and purchasing modules, as ASP.NET Core Web APIs over Entity
Framework Core, with MediatR and a CQRS split so that a read path optimised for
a busy list screen did not have to share a model with the write path behind an
approval.

The automation work sat on top of that. Personnel expense processing — business
travel and lodging — became a rule-based integration between the Otokoç and
Setur systems rather than a person comparing two screens. That single path came
down by more than 70% in processing time, and accounting and purchasing overall
by roughly 30%.

## The data underneath

Screens are the visible half. The other half is getting data in and back out:

- **50+ T-SQL stored procedures** for the logic that belongs next to the data
  rather than a network hop away from it.
- **6 SSIS packages** doing the ELT work — pulling from source systems on a
  schedule, landing it where the reporting layer could reach it.
- **API integrations** with the systems that had no other way in.
- **15+ SSRS reports**, each one routed to the working unit that actually needed
  it, so a purchasing lead and a finance lead were not reading the same generic
  export and drawing different conclusions.

Query performance was its own thread of work: execution-plan analysis, an
indexing strategy that matched how the screens actually queried, and
schema-level redesign where the shape itself was the problem.

## Migrating without stopping

The move from .NET Framework to .NET 8/9 microservices ran while the old system
kept serving. Framework support stayed alive in parallel, so no operational day
depended on the migration being finished. RabbitMQ carried messaging between
services, Redis took the read pressure off, and deployments went out through
Docker and Kubernetes with automated pipelines.

Work was tracked in Azure DevOps on a Scrum cadence — 20+ production-tracked
items, most of them starting life as a business requirements document that had
to be turned into something technical.

## What the team looked like

It started as three to four engineers. Two resigned, and for about two months I
was the only one on the module. Delivery carried on, which is mostly a statement
about how much of the module I had to have already understood rather than any
heroics during those two months.

## What I'd change

The reporting layer was point-to-point: each SSRS report was its own query
against the transactional schema. That is cheap for the first ten reports and
gets steadily more expensive for every one after, because each new report is a
fresh set of assumptions about the same tables. A modelled reporting layer —
conformed dimensions, one place where "an approved purchase" is defined — would
have made the report count something you could grow without the definitions
drifting apart. It is the lesson I took most directly into the data platform
work that came after.
