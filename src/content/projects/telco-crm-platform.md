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

## Context

Built as the capstone for the Turkcell GYGY 5.0 Java Development Track, a
120-hour programme I was selected for among 35 of roughly 5,000 applicants.

## What I'd change

Database-per-service is the right call for isolation, but it pushed every
cross-context read into either an event projection or a synchronous call. A
second pass would put more effort into read models built from the event stream
up front, rather than adding them reactively when a query turned out to need
data from three services.
