---
title: SaaS E-Commerce Platform
slug: saas-ecommerce-platform
track: production
role: Backend engineer — 4-person team
period: Dec 2023 — Feb 2025
summary: A Django backend and admin platform covering authentication, product, order and customer workflows plus reporting endpoints, taken from system design through to cloud deployment and handed over to a client who runs it themselves.
stack:
  - Python
  - Django
  - PostgreSQL
  - REST APIs
  - AWS (EC2, S3)
  - CI/CD
domains:
  - backend
metrics: []
links:
  github: null
  demo: null
featured: false
confidential: false
order: 80
---

## The problem

A paying client needed a commerce platform they could operate themselves —
catalogue, orders, customers, and the reporting to understand all three.

The obvious alternative was a hosted storefront. It is faster to stand up,
cheaper in the first year, and it puts the product catalogue, the order history
and the pricing rules inside someone else's schema, reachable only through
whatever their API chooses to expose. For a client whose operations _were_ the
product, that was the wrong trade — not because hosted platforms are bad, but
because the thing they most needed to change was the thing they would have had
least control over.

## Constraints

Four engineers and fourteen months, for a client who would be running the system
without us afterwards. That last part shaped more decisions than the stack did:
everything built had to be operable by people who were never going to read the
code.

## What made it hard

Commerce domains look simple until you write them down. An order is not one
thing. It is a cart, a claim against stock, a payment intent, a fulfilment record
and a row in a report — and each of those changes at a different moment, for a
different reason, at the request of a different part of the business. Model them
as one table because they arrive together, and every subsequent requirement
becomes a migration against live data.

## Decisions

**Self-hosted Django, not a hosted storefront.** Covered above. The cost is real
and was accepted knowingly: we owned the deployment, the upgrades and the
security posture that a hosted platform would have owned for us.

**One domain model behind both the API and the admin.** The internal admin
screens and the public REST endpoints describe the same products, orders and
customers. Two models would have let each side move independently, which sounds
like flexibility right up to the first time an order means something slightly
different to the two of them and no one can say which is correct.

**Authentication, product, order and customer as separate concerns from the
start.** More structure than a four-person team needs on day one, and the reason
the fourteenth month did not involve unpicking a single module that had absorbed
everything.

## What I built

Backend architecture and implementation as one of four engineers: the domain
model and its PostgreSQL schema, the REST endpoints, the admin platform over the
same model, the reporting endpoints, and deployment to AWS with CI/CD — from
system design through to production.

## Impact

The platform went to production and the client has operated it since, without
the team that built it. The reporting endpoints are what they run the business
from day to day, which is the outcome that mattered: not that the system worked
on handover, but that it kept working after it.

## What I'd change

The reporting endpoints read from the transactional tables directly. At this
size that is the right call — a separate reporting model is real work and buys
nothing until there is enough history to strain the queries. It is also the
first thing that strains, and by the time it does, every report that has been
written since is a fresh set of assumptions about the same tables. Knowing where
that line sits, rather than discovering it, is the part I would do differently.
