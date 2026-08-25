---
title: Klauthed
slug: klauthed
track: in-progress
role: Sole engineer
period: 2025 — present
summary: A multi-tenant identity platform in Rust — OAuth/OIDC, social login, MFA and custom domains — built as a set of services over CockroachDB, Redis and NATS.
stack:
  - Rust
  - Actix-web
  - SvelteKit
  - CockroachDB
  - Redis
  - NATS
  - ClickHouse
  - Kubernetes
  - Terraform
domains:
  - backend
  - distributed-systems
metrics: []
links:
  github: null
  demo: null
featured: true
confidential: false
order: 70
progress: In development — not yet released
---

## The problem

Identity is the piece every product needs and nobody wants to build. The hosted
options are good but opinionated, and the moment you need per-tenant custom
domains or a specific compliance posture, you are negotiating with someone
else's roadmap.

Klauthed is my attempt at the problem: a multi-tenant identity provider where
tenant isolation is a property of the data model rather than a filter applied
afterwards.

## Architecture

Rust services on Actix-web over CockroachDB for its distributed transactions and
survivability characteristics, Redis for session and token state, and NATS for
inter-service events. ClickHouse handles the audit and analytics side, which is
append-heavy and read-rarely. A SvelteKit console sits in front.

Scope in progress: OAuth/OIDC flows, social login, MFA, and per-tenant custom
domains.

## Decisions

**Tenant isolation in the data model, not as a filter.** The common approach is
one schema and a tenant column every query remembers to include. It works until
one query forgets, and the failure mode is a tenant reading another tenant's
identities — the single worst bug an identity provider can have. Making
isolation structural means the mistake is not available to make.

**CockroachDB rather than PostgreSQL.** Postgres would be the boring, correct
default and I would reach for it in most projects. Identity is the case where
survivability and distributed transactions are the product rather than a
nice-to-have: a login that fails because a region is down is an outage for every
tenant in it.

**ClickHouse for audit, not the transactional store.** Audit is append-heavy,
read-rarely, and grows without bound. Putting it beside the identities that must
stay fast means the two workloads compete, and audit always wins because there
is more of it.

**Rust, knowingly at the cost of speed.** A CRUD-shaped identity service would
go faster in almost anything else. The parts that are not CRUD-shaped — token
handling, session state, the audit path — are where a memory-safety guarantee
and an exhaustive type system stop being an aesthetic preference.

## Status

**This is unfinished and actively being built.** It is here because it is the
most technically demanding thing I am working on, not because it is ready to
use. There is no public repository yet and no release.

## What I've learned so far

Multi-tenancy is easy to describe and hard to keep honest. Every query, every
cache key, every event payload has to carry the tenant boundary, and the moment
one path forgets, the isolation guarantee is gone everywhere. Pushing that into
types rather than convention has been the single highest-leverage decision.
