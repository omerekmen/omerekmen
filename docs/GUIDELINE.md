# omerekmen.com — Working Guideline

Conventions this repo holds to, so the site stays current instead of drifting.

## Stack

SvelteKit 2 (Svelte 5 runes) · Tailwind 4 · GSAP · Paraglide i18n · Cloudflare Pages.
Fully prerendered — there is no backend and no database. Every content change is a commit
and a deploy.

## Content is data, translations are chrome

Project and CV content lives in Markdown (`src/content/`) and typed data files
(`src/lib/data/`). Paraglide holds interface strings only — labels, buttons, navigation.
Nothing that reads like a sentence about a career belongs in a translation key.

Do not reintroduce the `msg(key: string)` runtime lookup pattern. Import message functions
directly so a typo fails the build rather than rendering a key to a visitor.

## The CV is the source of truth

When the CV changes, the site changes in the same commit. Roles, dates, titles and skills
derive from one place: `src/lib/data/`. `static/llms.txt`, the JSON-LD block, `README.md`
and `/cv` are generated from it, never hand-edited in parallel. Parallel editing is what
produced the drift documented in `AUDIT.md`.

## Performance budget

Enforced by `bun run check:budget` in both workflows, so a regression surfaces
in the PR rather than six months later.

| Limit                         | Budget | Currently                            |
| ----------------------------- | ------ | ------------------------------------ |
| Homepage JS, gzipped          | 150 KB | ~113 KB                              |
| Largest single chunk, gzipped | 60 KB  | ~51 KB (GSAP)                        |
| Any one image or font         | 200 KB | largest is the social card at ~63 KB |
| Third-party requests          | 0      | 0                                    |

**Case-study prose must not reach a page that renders cards.** mdsvex compiles
each `.md` into a Svelte component whose module body builds templates at the top
level, so Rollup cannot treat the default export as side-effect-free — asking a
glob for `metadata` alone still drags in every compiled case study. Frontmatter
therefore comes from the `projectFrontmatter` plugin in `vite.config.ts`, which
reads the files at build time and emits parsed YAML; bodies come from
`project-bodies.ts`, imported only by routes that render them. Undoing that
split silently adds about 27 KB gzipped to every homepage visit and grows with
every word written.

Fonts are subset to the characters the copy actually uses; see the Latin ranges
in the subsetting note. Raising a budget is a decision to record in the commit
message, not a reflex when the check goes red.

**Third-party requests are zero, and that is a budget line rather than a
coincidence.** Every font is self-hosted, there is no analytics and no CDN
script, so the site fetches nothing a visitor did not ask for. The check reads
the built HTML and CSS and fails on any absolute URL in a fetching `<link>`,
a `<script src>`, an `<img src>` or a CSS `url()`. `hreflang`, canonical,
`og:url` and JSON-LD name the live domain on purpose and are ignored.

The way this regresses is a webfont: a `<link>` to Google Fonts is one line and
costs a render-blocking round trip to a host with its own privacy story. Self-host
it instead — download the woff2, subset it to the characters in use, and pin the
optical-size axis of a variable font, which is usually the difference between
130 KB and 50 KB.

## Motion is progressive enhancement

Every page must be fully readable and navigable with JavaScript disabled and with
`prefers-reduced-motion: reduce`. The reduced-motion path is tested, not assumed — that is
how the card-stacking bug survived to production.

Animation belongs in `$effect` with a GSAP context that is reverted on cleanup. Never leave
an element at `opacity: 0` in markup unless a non-JS fallback restores it.

## Accessibility floor

- Text contrast meets WCAG AA; no decorative text below 4.5:1 that carries meaning
- Type size floors, by role rather than a single number that nothing keeps:
  - Sentence-case reading text: **12px** minimum
  - Uppercase mono micro-labels carrying at least `0.1em` tracking: **10px**
    minimum — tracked caps stay legible where sentence case would not
  - Nothing renders below 10px
- Visible keyboard focus on every interactive element
- The real cursor is never suppressed without a working replacement

## SEO

Every page emits: title, description, canonical, Open Graph, Twitter card, and `hreflang`
alternates for all five locales. Project pages additionally emit `CreativeWork` JSON-LD.
The sitemap covers every locale variant with real `lastmod` dates.

## Adding a project

Projects are Markdown files in `src/content/projects/`. Frontmatter is data, the
body is the case study. Both are validated at build time — a malformed file
fails the build rather than rendering a broken page.

1. Create `src/content/projects/<slug>.md`. The filename is the slug and the URL.
2. Fill in the frontmatter:

```yaml
title: TELCO CRM Platform
slug: telco-crm-platform # must match the filename
track: production # production | in-progress | lab | archive
role: Backend engineer -- capstone team
period: Mar 2026 -- Jul 2026 # quote bare years, or YAML reads them as numbers
summary: One or two sentences. Used on cards and as the meta description.
stack: [Java 21, Spring Boot, Kafka]
domains: [backend, distributed-systems]
metrics:
  - { label: Bounded contexts, value: '9' }
links: { github: null, demo: null }
featured: true # show on the homepage carousel
confidential: false # true when employer detail must be withheld
order: 100 # higher sorts first within a track
progress: 15 of 22 services # in-progress only; replaces the track label
```

3. Write the body. The established shape is problem, architecture, what I built,
   outcome, what I'd change. That last section is what separates a case study
   from a CV bullet.
4. Commit and push. CI validates and deploys on merge.

No translation keys, no TypeScript edits, no route wiring.

### Translating a project

Add `<slug>.<locale>.md` beside the original — `telco-crm-platform.tr.md`. It
carries the same frontmatter shape and its own body; both are used in full.

A project without a translation for the active locale falls back to the English
original and shows a localised notice saying so, rather than disappearing from
the list. `<slug>.md` with no locale suffix is the English original and is
required — a translation without one fails the build.

### Tracks

| Track         | Meaning                                                 |
| ------------- | ------------------------------------------------------- |
| `production`  | Shipped, real users, CV-backed                          |
| `in-progress` | Actively built, honestly labelled, not finished         |
| `lab`         | Purpose-built to demonstrate a stack                    |
| `archive`     | Earlier work kept for its URL and history, not featured |

`metrics` describe outcomes of the system, not credentials about the author. A
selection rate or a certificate belongs in the body.

Archived projects keep their URLs and stay in the sitemap at lower priority, but
are excluded from the homepage carousel.

## Case-study structure

Every study answers the same questions in the same order, so two projects can be
compared without re-learning the format. This is a **shape, not a word count** —
a floor produces padding, and padding is the thing it was supposed to prevent.

| Heading                | What it answers                                                             |
| ---------------------- | --------------------------------------------------------------------------- |
| `## The problem`       | What the system had to do, in business terms, before any technology appears |
| `## Constraints`       | Team size, timeline, what was already in production, what could not change  |
| `## What made it hard` | The two or three things that made it genuinely difficult, specifically      |
| `## Decisions`         | What was chosen, what was rejected, and the reason it lost                  |
| `## What I built`      | The implementation, briefly                                                 |
| `## Impact`            | The numbers, each with what was measured and against what baseline          |
| `## What I'd change`   | The retrospective, and what it changed about the next project               |

**The problem**, **Decisions**, **What I built** and **What I'd change** are
required. **Constraints**, **What made it hard** and **Impact** appear when there
is something true to put in them — an empty section is worse than a missing one,
and a study padded to reach a heading reads exactly like a study padded to reach
a heading. A project may add its own headings (`## Architecture`, `## Status`,
`## Where it is going`) where they carry something the standard set does not.

### Decisions carry most of the weight

This is the section that separates a builder from an engineer, and the one most
likely to be skipped because it is the hardest to write. A decision entry names
the alternative and why it lost:

> **Kafka domain events as the only cross-context state, not synchronous calls.**
> Billing could have asked Ordering for an order. Then Billing is down when
> Ordering is, and the dependency is invisible until it fails.

Not "we used Kafka for event-driven architecture". The rejected option is the
content.

Never claim a formal evaluation that did not happen. Stating the reasoning
behind a choice is honest; describing a trade study nobody ran is not. Phrase it
as why the choice is right, not as the minutes of a meeting.

### Every metric names its basis

A number with no basis is the number an interviewer asks about, and "I'd have to
check" costs more than never having shown it. State what was measured and
against what:

> That figure is dashboard load time, before and after the query and indexing
> work, on the same portfolio — roughly a hundred property listings.

Distinguish **measurements** from **counts**. Nine services and fifty stored
procedures are counts and should say so; a percentage is a measurement and needs
a baseline. Where a number cannot be sourced, **cut it** — an unsourced metric
is worth less than no metric.

### Archive projects stay short

`track: archive` exists for work kept for its URL and its history. A brief entry
that says what it was and why it is archived is honest; expanding it to match a
production study is the padding this section exists to prevent.

## Diagrams

A case study about a distributed system with no picture in it asks the reader to
hold an architecture in their head from prose alone. Most will not; they skim for
the diagram, find nothing, and leave with no idea what was built.

Diagrams are **data, not drawings**. A definition lives at
`src/lib/diagrams/<slug>.ts` and the detail page picks it up by slug — so a
project gains a diagram by adding one file, with no markdown edit in any locale.
`SystemDiagram.svelte` owns geometry, theming, the legend and the accessible
description.

Authors place nodes on a grid (`col`, `row`, optional spans) and name the edges.
Everything else is derived, so no diagram carries hand-tuned coordinates that the
next edit has to preserve.

```ts
{ id: 'ingest', label: 'Ingestion', detail: 'Azure Data Factory',
  kind: 'process', col: 1, row: 1 }
```

`kind` is what a box _is_, and it decides how the box is drawn: `source`
(upstream, not owned here), `process`, `store`, `serve`, `legacy` (being
retired) and `target` (what replaces it). Colour comes from the theme tokens —
accent for the main flow, `ongoing` for what is going away, `completed` for what
arrives — so a palette change carries automatically and contrast stays vetted.
Only the kinds a diagram actually uses reach its legend.

Rules that keep them honest and readable:

- **Draw what the system does, not the version you wish you had shipped.** The
  property-management dashboard reads straight off the transactional schema in
  the picture because that is what it does, and the retrospective argues about
  exactly that edge. Routing it through an imaginary modelled layer would be
  describing a system that does not exist.
- **Draw one real journey, not every possible connection.** The TELCO CRM has
  nine services; wiring all of them to each other produces noise. An order
  arriving, becoming an event, and billing and notification reacting to it is
  the same architecture and is legible.
- **A migration diagram shows both halves live.** Only drawing the target state
  hides the thing that made the work hard.
- **Diagrams render at natural size and scroll**, rather than scaling to fit.
  Scaling looked tidier and put the mono detail line at roughly 6px on a phone,
  which is under the type floor above. A diagram nobody can read is not a
  smaller diagram, it is a missing one.
- **Every diagram carries a text alternative.** `<title>` and a `<desc>`
  generated from the edges, so the flow is available to a reader who is not
  looking at it.
- **Translate only the generic words.** Product names stay as they are in
  Turkish technical writing too, so `locales` holds a handful of overrides
  rather than forty message keys nobody maintains.

## Colour

`--color-accent` is decorative: fills, borders, oversized display type, the dot
grid. On light surfaces it sits at roughly 1.8:1, so it must never carry text.

`--color-accent-text` is the readable accent — 4.6:1 or better on every light
surface, identical to `--color-accent` in dark. Use it for any accent-coloured
text a person is meant to read. The Tailwind utility is `text-accent-text`.

The same split applies to the status hues: `--color-completed` and
`--color-ongoing` fill the badges, `--color-completed-text` and
`--color-ongoing-text` carry their labels. The fill colours measure 1.6:1 to
2.0:1 against their own tinted pill, so they can never be the text.

`bun run check:contrast` asserts every text/surface pair in both themes,
including badge text over its composited pill, and runs in both workflows. It
reads the tokens directly rather than needing a browser, so a regression is
caught in a second.

Avoid opacity modifiers on text tokens (`text-text-muted/60`). They move a
colour the check has verified to one it has not.

## Branch and deploy

| Branch    | Serves          | Verified by                        |
| --------- | --------------- | ---------------------------------- |
| `staging` | the preview URL | `.github/workflows/ci-staging.yml` |
| `master`  | omerekmen.com   | `.github/workflows/ci.yml`         |

Cloudflare Pages is connected to this repository and deploys both branches
itself: `master` as production, `staging` as the preview branch. Nothing in
GitHub Actions deploys — the workflows only gate quality, because Cloudflare
runs the build but not lint or typecheck.

Work lands on `staging` first and is reviewed there before merging to `master`.

Each workflow also asserts the search posture of its build: staging must carry
`noindex` and disallow crawling, production must do neither. Both directions
fail quietly and cost real traffic, so neither is left to configuration alone.

### Marking a build as staging

A staging copy that gets indexed competes with the live site for its own name,
so this is enforced from two directions in `vite.config.ts`:

- `PUBLIC_SITE_ENV=staging` — set explicitly by a workflow
- `CF_PAGES_BRANCH` other than `master` — set by Cloudflare's own builds

Either marks the build as staging, which emits a `noindex` meta tag, serves a
`Disallow: /` robots.txt and shows a corner flag. Any Cloudflare build off a
non-production branch falls back to staging, so a preview can never ship as
indexable production by omission.

Commit messages are plain and descriptive, written in the author's own voice. No tooling
attribution, no co-author trailers.

## The one dynamic route

Everything is prerendered except `/api/geo`, which runs on the edge to report
the visitor's country. The relocation notice in the hero uses it to stay hidden
inside Turkey.

The notice is hidden by default and revealed only once a country comes back, so
it cannot flash before the check completes, and a failed lookup leaves it
hidden. It is also hidden on the `tr` locale regardless of country.

Geo-gating is a soft signal, not a privacy control — a VPN, a cached copy or a
link preview generated elsewhere all route around it. See docs/ROADMAP.md.

## Commands

```
bun run dev       # dev server
bun run build     # production build
bun run check     # svelte-check
bun run lint      # prettier + eslint
bun run format    # write formatting
```
