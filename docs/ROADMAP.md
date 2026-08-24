# omerekmen.com — Rebuild Roadmap

## Status

| Phase                     | State                                     |
| ------------------------- | ----------------------------------------- |
| 00 — Truth pass           | Done                                      |
| 01 — Foundation           | Done                                      |
| 02 — Content pipeline     | Done                                      |
| 03 — Case studies         | Blocked on input (NDA scope, screenshots) |
| 04 — Three directions     | Built — awaiting your pick                |
| 05 — Positioning & polish | Not started                               |
| 06 — Lab projects         | Optional                                  |

Payload after phase 01: client JS 1.02 MB → 328 KB raw, fonts 742 KB → 115 KB,
OG image 1.8 MB → 106 KB. Roughly 3.1 MB removed from a cold visit.

## Decisions locked

| Area     | Decision                                                                 |
| -------- | ------------------------------------------------------------------------ |
| Projects | CV set + Klauthed/Scivex as in-progress + new data-engineering showcases |
| Content  | Markdown case studies in the repo                                        |
| Visual   | Prototype all three directions, decide after seeing them                 |
| Audience | Loud EU/NL relocation signalling, gated for visitors in Turkey           |

## Content architecture

One file per project. Frontmatter is data, body is the case study. Rendered with `mdsvex`
plus a Vite glob import, so case studies stay fully prerendered at zero runtime cost, and
Svelte components (diagrams, interactive pipeline visuals) can be embedded in the prose.

```
src/content/projects/
  telco-crm-platform.md
  video-transcription-pipeline.md
  nesin-property-platform.md
  saas-ecommerce-platform.md
  klauthed.md
  scivex.md
```

```yaml
title: TELCO CRM Platform
slug: telco-crm-platform
track: production # production | in-progress | lab
role: Backend engineer, 4-person capstone team
period: 2026-03 .. 2026-07
summary: Telecommunications CRM spanning KYC, catalog, ordering,
  subscriptions, billing and ticketing.
stack: [Java 21, Spring Cloud, Kafka, PostgreSQL, Redis, Kubernetes]
domains: [data-engineering, backend, distributed-systems]
metrics:
  - { label: Services, value: 9 }
  - { label: Events/day, value: '1.2M' }
links: { github: '...', demo: null }
cover: ./media/telco-architecture.svg
featured: true
confidential: false # gates NDA-sensitive detail
---
## The problem
## Architecture
## What I built
## What I'd change
```

**Translation policy.** UI chrome stays in Paraglide across all five locales. Case-study
bodies ship English-only (Turkish optional per file, falling back to English). Translating
long-form technical narrative five ways is what makes portfolios rot.

## Project tracks

| Track       | Contents                                                            | Purpose                                          |
| ----------- | ------------------------------------------------------------------- | ------------------------------------------------ |
| Production  | TELCO CRM, Nesin property platform, SaaS e-commerce, video pipeline | Shipped, CV-backed, carries the most weight      |
| In progress | Klauthed, Scivex                                                    | Honestly labelled with a specific progress state |
| Lab         | Airflow/dbt pipeline, Kafka→Spark demo, Fabric/ADF writeup          | Publishable evidence for the DE stack            |

In-progress labels must be specific. "Ongoing" reads as abandoned; "In development · 15 of
22 services · targeting v0.1 Q4" reads as an engineer shipping something hard. Klauthed
currently claims 15 microservices with no repository link — either link something
verifiable or state plainly why it is closed.

## Geo-gating the relocation banner

Every route is prerendered, so the Cloudflare Worker never runs for a page request and
`request.cf.country` is unreachable as things stand. Options:

- **A (chosen).** One non-prerendered `/api/geo` route reads `platform.cf.country`. Banner
  ships hidden and reveals for non-TR visitors. Keeps the site fully static. Also hide on
  the `/tr` locale.
- **B.** Drop prerendering on `/`, read the country in `+layout.server.ts`. Correct HTML on
  first paint, but the homepage becomes edge-rendered instead of CDN-cached.
- **C.** Gate on locale only. Zero infra, but not a geo gate.

**Caveat.** This is a soft signal, not a privacy control. VPNs, Google's cache, link
previews generated outside Turkey, `llms.txt` and JSON-LD all route around it. A lower-risk
alternative is to keep the homepage neutral and place work authorisation only on `/cv` and
in structured data.

## Phases

Ordered by value per hour. Every phase ends deployable.

### 00 — Truth pass (done)

- Remove the GPA everywhere it renders
- Headline → "Software Engineering & Data Engineering", site-wide including `/s` and `/cv`
- Experience: SeturTech current, Otokoç closed May 2026, freelance track added
- Add Turkcell GYGY 5.0 with the 35-of-5,000 selection detail
- Rewrite skills taxonomy around Fabric, ADF, Azure SQL, Kafka, Spring, .NET 8
- Single source of truth for email and phone; fix `llms.txt`, JSON-LD and README

### 01 — Foundation (done)

- Delete 1,487 lines of dead code
- Vendor inlang plugins; remove the build-time CDN dependency
- Replace three.js with Canvas 2D (recovers 181 KB gzip)
- Compress `og-image.png`, subset Bagel Fat One, drop unused fonts
- Fix reduced-motion stacking bug; scope the footer out of `/s` and `/cv`
- Add real navigation; make the custom cursor fail safe

### 02 — Content pipeline (done)

- Wire `mdsvex` + typed frontmatter validation
- Migrate the existing five projects to Markdown as the proving run
- Build `/projects` with track and stack filtering
- Rebuild the detail template: problem → architecture → build → outcome → retrospective
- Per-project OG images, JSON-LD, hreflang across all locales

### 03 — Write the case studies (needs input)

Four production projects, two in-progress, with diagrams and screenshots. Slowest phase,
and the one that wins interviews.

### 04 — Three directions → pick one (built)

Live at `/lab` (all `noindex`, disallowed in robots.txt). Each renders the same
real content — same hero copy, same three projects, same case study — from
`src/routes/lab/sample.ts`, so the comparison is of design and nothing else.

A and B commit to a single dark treatment; C carries both light and dark. C is
the only one that pulls a webfont (Newsreader, via Google Fonts) — if it wins,
that gets self-hosted and subset like the others.

- **A — Refined Kinetic.** Current identity executed properly. Display font and scroll
  choreography stay; real imagery, fixed contrast, working reduced-motion path, Canvas 2D.
- **B — Systems.** Display font recedes, the work becomes the visual. Architecture diagrams,
  schema motifs, pipeline flows, metric strips. Strongest fit for enterprise EU hiring.
- **C — Editorial.** Full redesign. New type system and grid, motion reduced to a few
  deliberate moments, long-form case studies as the centrepiece.

Watch as you compare: the rounded display face and giant repeating `WORK` letters read as a
creative-agency portfolio — an asset for design-adjacent roles, a mild liability for
enterprise data engineering.

### 05 — Positioning & polish

- Geo-gated relocation banner via `/api/geo`, hidden on `/tr`
- Regenerate `cv.pdf` from the new CV; sync `/cv` to match exactly
- Sitemap covering locales and the projects index, with real `lastmod` dates
- Lighthouse and axe passes; performance budget enforced in CI

### 06 — Optional: lab projects

Airflow/dbt pipeline and a Kafka streaming demo.

## Blocked on input

- **NDA boundaries** for Otokoç ERP and SeturTech Fabric work. The strongest CV material is
  also the most likely to be restricted. The `confidential` frontmatter flag exists for this.
- **Screenshots and diagrams** — dashboards, architecture sketches, whiteboard photos.
- **Klauthed and Scivex status** — real completion state, and whether either repo can go public.
- **Disclosable metrics** beyond the 70% and 60% figures already on the CV.
- **TELCO CRM repo visibility** — if public it becomes the anchor case study.
- **The relocation placement question** — loud-and-gated, or the quieter CV-only option.
