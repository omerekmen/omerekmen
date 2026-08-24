---
title: Travel Group Data Platform
slug: travel-data-platform
track: production
role: Data engineer — SeturTech data team
period: Jul 2026 — present
summary: The data platform behind a Koç Group travel company — ELT from live systems, integrations, API endpoints and file drops into a Fabric lakehouse and warehouse, serving reporting, forecasting and R&D from one governed set of models.
stack:
  - Microsoft Fabric
  - Azure Data Factory
  - Azure SQL Database
  - Azure Functions
  - Power BI
  - Python
  - Parquet
  - Dynamics 365
  - SAP
domains:
  - data-engineering
  - analytics
metrics: []
links:
  github: null
  demo: null
featured: true
confidential: false
order: 99
---

## The problem

Setur is Koç Group's travel and tourism company, and its data does not arrive
from one place or in one shape. Some of it lives in operational systems that are
being written to right now. Some arrives from partner integrations. Some comes
from API endpoints on someone else's schedule, and some simply appears as
Parquet files.

Every business unit needs an answer from that data — C-level, finance and
accounting, customer support and their leads — and each one had historically got
it by asking someone to pull an extract. That works until two extracts disagree,
and then nobody can tell which number is wrong.

## The shape of the platform

Five stages, and the value is in the boundaries between them:

1. **Source systems** — Dynamics 365, SAP, CRM platforms, partner integrations,
   REST endpoints, dropped files.
2. **Ingestion** — Azure Data Factory copy and orchestration pipelines, with
   retries and watermarking, so a failed run resumes instead of reprocessing a
   history that has not changed.
3. **Lakehouse** — raw files become tables in Microsoft Fabric. Transformations
   run in Fabric notebooks in Python, where the logic can be read and reviewed
   rather than being buried in a visual designer.
4. **Warehouse** — conformed models the whole company reads from, so two reports
   asking the same question return the same number.
5. **Serving** — Power BI for reporting, Azure SQL Database and Azure Functions
   where something needs to be queried or triggered directly, and the same
   governed datasets underneath the prediction and R&D work.

## What I do

Build and operate the pipelines: the ingestion from each source, the
transformations that turn it into something modelled, and the scheduling that
keeps it current without anybody asking. Integrating a source system means
understanding what it means as much as how to read it — an SAP record and a CRM
record describing the same customer have to agree before either is worth
reporting on.

The recurring manual extract is the thing being replaced. Every one that becomes
a scheduled pipeline is a category of disagreement that stops happening.

## Reporting, prediction, and the work after it

Reporting is the visible output, but it is not the only consumer. Forecasting
and R&D read from the same governed models rather than from their own extracts,
which is the whole point of putting the warehouse in the middle: an experiment
and a board report disagreeing about last quarter is a much worse problem than
either of them being slightly late.

## What I'd change

The honest constraint is coverage. A governed model is only as useful as the
share of the business that actually reads from it, and there is still reporting
that predates the platform and reaches around it. Retiring those paths is
slower and less interesting than building new ones, and it is where most of the
remaining value is.
