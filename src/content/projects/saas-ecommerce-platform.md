---
title: SaaS E-Commerce Platform
slug: saas-ecommerce-platform
track: production
role: Backend engineer — 4-person team
period: Dec 2023 — Feb 2025
summary: A Django backend and admin platform covering authentication, product, order and customer workflows plus reporting endpoints, taken from system design through to cloud deployment.
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
catalogue, orders, customers and the reporting to understand all three — rather
than a storefront bolted onto a hosted service they did not control.

## Architecture

A Django backend exposing REST endpoints, with an admin platform over the same
domain model. Authentication, product, order and customer workflows are modelled
as distinct concerns with reporting endpoints layered on top. Deployed to AWS
with CI/CD.

## What I built

Backend architecture and implementation as one of a four-person team, from
system design through to cloud deployment.
