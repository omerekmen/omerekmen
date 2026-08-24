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

1. Create `src/content/projects/<slug>.md` with complete frontmatter
2. Add media under `src/content/projects/media/`
3. Set `track` honestly: `production`, `in-progress` or `lab`
4. Set `confidential: true` if employer detail must be withheld
5. Commit and push — CI validates the frontmatter schema and deploys on merge

No translation keys, no TypeScript array edits, no route wiring.

## Branch and deploy

Work on feature branches. `master` auto-deploys to Cloudflare Pages via `.github/workflows/cd.yml`.
CI runs lint, typecheck and build on every PR.

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
