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

Enforced in CI — regressions surface in the PR, not six months later.

- Homepage client JS under 150 KB gzipped
- No single dependency over 50 KB gzipped without a written reason
- Images under 200 KB
- Fonts subset to the characters actually used

## Motion is progressive enhancement

Every page must be fully readable and navigable with JavaScript disabled and with
`prefers-reduced-motion: reduce`. The reduced-motion path is tested, not assumed — that is
how the card-stacking bug survived to production.

Animation belongs in `$effect` with a GSAP context that is reverted on cleanup. Never leave
an element at `opacity: 0` in markup unless a non-JS fallback restores it.

## Accessibility floor

- Text contrast meets WCAG AA; no decorative text below 4.5:1 that carries meaning
- No body or label text below 12px
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

## Colour

`--color-accent` is decorative: fills, borders, oversized display type, the dot
grid. On light surfaces it sits at roughly 1.8:1, so it must never carry text.

`--color-accent-text` is the readable accent — 4.6:1 or better on every light
surface, identical to `--color-accent` in dark. Use it for any accent-coloured
text a person is meant to read. The Tailwind utility is `text-accent-text`.

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

## Commands

```
bun run dev       # dev server
bun run build     # production build
bun run check     # svelte-check
bun run lint      # prettier + eslint
bun run format    # write formatting
```
