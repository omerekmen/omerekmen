---
title: TELCO CRM Platform
slug: telco-crm-platform
track: production
role: Backend engineer — capstone team, Turkcell GYGY 5.0
period: Mar 2026 — Jul 2026
summary: A telecommunications CRM built as Spring Cloud microservices, covering the full subscriber lifecycle from KYC and catalog through ordering, billing and support ticketing.
stack:
  - Java 21
  - Spring Boot
  - Spring Cloud
  - Spring Data JPA
  - Spring Security
  - PostgreSQL
  - Kafka
  - Redis
  - Docker
  - Kubernetes
  - OpenTelemetry
domains:
  - backend
  - distributed-systems
metrics:
  - { label: Bounded contexts, value: '9' }
  - { label: Databases, value: '9' }
links:
  github: null
  demo: null
featured: true
confidential: false
order: 100
---

## The problem

A telecom operator's CRM has to hold a subscriber's entire lifecycle in one
coherent view — identity and KYC, the product catalog they bought from, their
orders, active subscriptions, metered usage, invoices, payments, notifications
and support tickets. Those concerns change at very different rates and under
very different load. Modelling them as one application makes every deployment a
whole-system risk.

## Constraints

A capstone team on a fixed programme timeline, building a system nobody would
operate afterwards. That cuts both ways: no production traffic to be wrong
about, and no operational feedback to correct the design either. Everything
below is an argument that had to be made from first principles rather than from
a pager.

## What made it hard

The subscriber lifecycle is one story to a customer and nine different rates of
change to an engineer. A catalog changes when marketing says so; usage changes
continuously; an invoice changes once a month and then must never change again.
Holding all of that in one application means every deployment carries the risk
of all nine, and the parts that change most often hold the parts that must not.

## Decisions

**Database per service, not a shared schema behind separate services.** The
cheaper option — one database, nine deployables — gives you the deployment story
without the isolation, and the first cross-context join quietly turns it back
into a monolith with extra network calls. The cost is paid honestly below.

**Kafka domain events as the only cross-context state, not synchronous calls.**
Billing could have asked Ordering for an order. Then Billing is down when
Ordering is, and the dependency is invisible until it fails. Events invert it:
Ordering states what happened and stops caring who listens.

**Redis only where reads dominate and change is rare.** Catalog and eligibility
lookups qualify; orders and usage do not. A cache in front of data that changes
constantly buys latency and sells correctness, which is the wrong direction for
a billing system.

**Nine contexts, not three.** Fewer, larger services would have been less work
and would have put usage, billing and subscriptions — three genuinely different
rates of change — back into one deployment.

## Architecture

The platform is split into nine services along bounded-context lines, each
owning its own PostgreSQL database. No service reaches into another's tables;
state moves between them as Kafka domain events.

- **API Gateway** — single entry point, routing, JWT/OAuth2 verification
- **Customer / KYC** — identity, verification state, consent
- **Catalog** — products, tariffs, eligibility rules
- **Ordering** — order capture and orchestration
- **Subscription** — lifecycle state per subscriber
- **Usage** — metered consumption
- **Billing & Payment** — invoicing and settlement
- **Notification** — outbound messaging
- **Ticketing** — support cases

Redis carries read-through caching for catalog and eligibility lookups, which
are read-heavy and change rarely. Observability is Prometheus and Grafana with
OpenTelemetry tracing across service boundaries, so a single order can be
followed end to end.

## What I built

Backend services and the event contracts between them, plus the containerisation
and Kubernetes manifests the team deployed with.

## Impact

Nine services running on Kubernetes with a single order traceable end to end
across service boundaries through OpenTelemetry — which is the outcome that
matters for a system with no users yet, because distributed tracing is what
turns "the order failed somewhere" into a specific service and a specific span.

The two numbers on this page are counts rather than measurements: nine bounded
contexts, nine databases, one per service by construction.

## Context

Built as the capstone for the Turkcell GYGY 5.0 Java Development Track, a
120-hour programme I was selected for among 35 of roughly 5,000 applicants.

## What I'd change

Database-per-service is the right call for isolation, but it pushed every
cross-context read into either an event projection or a synchronous call. A
second pass would put more effort into read models built from the event stream
up front, rather than adding them reactively when a query turned out to need
data from three services.
