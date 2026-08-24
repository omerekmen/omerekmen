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

## Architecture

A Django backend over a PostgreSQL schema of 15+ normalised tables, modelling
properties, tenancies, payment schedules, expense categories and the
reconciliation between them. Deployed on AWS with CI/CD.

## What I built

Backend architecture and implementation, the database schema, the reporting
endpoints and the deployment pipeline — from requirements analysis through to
production, as one of a two-person team.

## Outcome

The reporting dashboard was the slowest surface in the system, because it
aggregated across the full history on every load. Query restructuring and a
considered indexing strategy cut its load time by 60%.

## What I'd change

The reporting layer reads straight from the transactional schema. That is the
right starting point at this size, but the aggregations are the part that will
strain first — a materialised reporting view, refreshed on write, would take the
pressure off before it becomes a problem.
