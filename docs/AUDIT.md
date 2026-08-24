# omerekmen.com — Audit

Performed against `master` @ `cdeca77`. All measurements taken from a local production build.

## Measured

| Metric | Value |
| --- | --- |
| three.js chunk | 725 KB raw / 181 KB gzip |
| GSAP + plugins chunk | 139 KB raw / 54 KB gzip |
| Total client JS | 1.02 MB raw |
| `static/og-image.png` | 1.8 MB |
| Fonts shipped | 738 KB (11 KB unreferenced) |
| Dead code | 1,487 of 5,619 source lines (26%) |
| Routes prerendered | 100% — the Worker never runs for a page request |

## Content drift (highest value, no design work required)

The site and the updated CV describe two different engineers.

| Field | Site | Updated CV |
| --- | --- | --- |
| Headline | Data Scientist & Software Engineer | Software Engineering & Data Engineering |
| Current role | SWE Intern, Otokoç — Present | Data Science Engineer, SeturTech (Koç Group), Jul 2026–Present |
| Otokoç | Ongoing | Working Student, 24 months, ended May 2026 |
| Freelance | Absent | Dec 2023–Feb 2025, two production systems |
| Projects | Klauthed, Scivex, SpaceX, Data Analysis | TELCO CRM, video pipeline, Nesin property platform, SaaS e-commerce |
| Certifications | IBM only | Turkcell GYGY 5.0 (35 of ~5,000) + IBM |
| Education | GPA 2.99 displayed | GPA omitted |
| Relocation | Silent | EU Blue Card + NL Highly Skilled Migrant eligible |

**Fix immediately:** the site publishes the 2.99 GPA that the CV deliberately drops.
`src/lib/data/education.ts` and hardcoded again in `src/routes/cv/+page.svelte`.

**Keyword gap:** Microsoft Fabric, Azure Data Factory, Azure SQL, Kafka, Spring Cloud, dbt,
Airflow and Spark appear nowhere on the site. The skills marquee still leads with a 2023
data-science profile.

## UI/UX findings

**Critical — reduced-motion users see all project cards stacked.**
`WorkSection.svelte` sets every slide to `opacity: 1` under `prefers-reduced-motion`, but
`.project-slide` is `position: absolute; top: 50%; left: 50%`. Without the GSAP timeline to
separate them they render in one unreadable pile.

**Critical — the project detail page carries almost no information.**
Description, 2–4 one-line highlights, stack pills. No imagery, architecture, dates, role,
team size, problem statement or outcome. The headline metadata stat is `Technologies: 5`,
a count of the array beneath it.

**High — no projects index, and the carousel does not scale.**
Projects are reachable only through the pinned homepage carousel, whose height is
`200 + N × 200` vh — 1,200 vh for five projects, 2,200 vh at ten.

**High — the full-screen contact footer renders on every route.**
`ContactFooter` lives in `+layout.svelte`, so the `min-h-screen` accent block appends to
`/s` and `/cv`. `+page.svelte` also imports it and comments out the usage.

**High — the custom cursor hides the real cursor site-wide.**
`cursor: none !important` on `html` and all descendants. If GSAP fails to initialise the
user has no pointer, and text-selection affordance is suppressed everywhere.

**Medium — contrast and type size.** `text-text/3` watermarks (3% opacity); 9–11px mono
labels across cards, badges and indicators.

**Medium — no navigation; `/s` and `/cv` still print the stale tagline.**

## Technical findings

**High — build depends on a third-party CDN and fails soft.**
`project.inlang/settings.json` loads inlang plugins from `cdn.jsdelivr.net` at build time.
CI is fine today. The risk is the partial case: eight call sites are written as
`m.foo?.() ?? 'English fallback'`, so a degraded compile produces a green build that
silently ships English to non-English visitors. Vendor the plugins locally.

**High — dynamic message lookup discards type safety.**
Four components use `msg(key: string)`, indexing the messages namespace at runtime and
returning the raw key on a miss. A typo renders `project_klauthed_titel` to a visitor.

**High — five locales prerendered with no hreflang, no per-page metadata.**
No `rel="alternate"` anywhere; the sitemap lists English routes only. Project detail pages
emit no Open Graph tags, no Twitter card and no JSON-LD.

**Medium — 26% of the source tree is unreachable.**
`Dock.svelte`, `MacWindow.svelte`, `windows/*Content.svelte`, `ProjectCard.svelte` and
`windows.svelte.ts` — remnants of an abandoned macOS-desktop concept, still linted and
type-checked on every CI run.

**Medium — asset weight unmanaged.** 1.8 MB OG image (should be ~60 KB); 271 KB unsubset
Bagel Fat One; two unreferenced RubikMonoOne files.

**Medium — contact details disagree.** `personal.ts` says `omer@omerekmen.com`; `/cv`
hardcodes `omerekmenn@gmail.com`; JSON-LD uses the Gmail address. The CV now also carries a
phone number the site lacks.

## What is working

Svelte 5 runes used correctly. GSAP contexts reverted on cleanup. Three.js scene disposes
geometries and materials. Sensible CI/CD split. Prerendering configured properly. A
`prefers-reduced-motion` check in every animated component. This is a refactor, not a rescue.
