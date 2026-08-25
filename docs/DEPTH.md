# Reading as a senior engineer

A plan for the work after phase 06. Where `ROADMAP.md` tracks phases and
`GUIDELINE.md` fixes the rules, this document answers one question: what does a
senior engineer look for when they open this site, and what do they find today?

## The framing, stated plainly

The CV says 2.5 years. A reader checks dates within about five seconds, so a
portfolio that reaches for the word "senior" loses on the first screen — and
the reach itself reads junior.

What is available instead is **judgement**, and judgement does not have a
minimum years requirement. The gap between a mid portfolio and a senior one is
almost never the size of the systems. It is:

| Mid reads like                      | Senior reads like                                     |
| ----------------------------------- | ----------------------------------------------------- |
| Here is what I built                | Here is what I chose, and what I gave up for it       |
| A list of everything I have touched | Four things that matter, in order                     |
| "Reduced processing time by 70%"    | "70%, measured over N claims against the H1 baseline" |
| Prose describing an architecture    | The diagram, then the prose                           |
| Screens and features                | What broke, what I instrument, how I roll back        |

Everything below follows from that table. None of it requires a promotion.

## What a senior reader checks, and what is there today

Evidence gathered from the repository at `0e2a7ba`.

### 1. The diagram — missing entirely

Ten case studies about microservices, ELT pipelines, a lakehouse and a
strangler-fig ERP migration. **Zero diagrams, zero images, zero figures**:

```
$ grep -rn '!\[|<img|<svg|<figure' src/content/projects/*.md
(no matches)
```

A senior reader skims for the picture before reading a word. On this site there
is nothing to skim, so the architecture only exists for someone who reads all
595 words. This is the single largest gap on the site and it is fully unblocked:
the prose already describes each system precisely enough to draw it, and a
drawn architecture carries no more disclosure risk than the paragraph that
describes it.

### 2. The floor, not the ceiling, sets the impression

Case-study body length, English originals:

| Project                      | Words  | Track       | On the homepage |
| ---------------------------- | ------ | ----------- | --------------- |
| erp-modernisation            | 595    | production  | yes             |
| travel-data-platform         | 471    | production  | yes             |
| telco-crm-platform           | 292    | production  | yes             |
| property-management          | 277    | production  | yes             |
| klauthed                     | 220    | in-progress | yes             |
| scivex                       | 175    | in-progress | yes             |
| video-transcription-pipeline | 170    | production  | yes             |
| spacex-falcon9               | 112    | archive     | no              |
| **saas-ecommerce-platform**  | **97** | production  | **yes**         |
| data-analysis                | 82     | archive     | no              |

A reader forms their judgement on whichever link they happen to click, not on
the best one. Two of the newest studies are 3–6× the depth of the median, which
makes the older ones read as abandoned rather than brief.

### 3. `featured` is dead code, and it is costing the front page

`featuredProjects()` filters on `track !== 'archive'` and never reads the
`featured` frontmatter flag at all. The consequence is concrete:
**`saas-ecommerce-platform` is marked `featured: false`, has 97 words and no
metrics, and is on the homepage anyway** — verified in the built output.

All eight non-archive projects are in the homepage stack. At `180 + n * 190`
vh that is a **1700vh** scroll before a visitor reaches anything else, and the
weakest case study on the site is one of the eight cards they pass.

### 4. Numbers without a basis

Metrics coverage across the ten studies:

- 4 projects carry metrics: erp-modernisation (4), property-management (3),
  telco-crm-platform (2), spacex-falcon9 (1)
- **6 carry none** — including `travel-data-platform`, the current role

And where numbers do exist they are unsourced. `-70%` on expense processing is
the strongest claim on the site; it currently says nothing about what was
measured, over what period, against what baseline. An interviewer probes
exactly that number, and "I would have to check" is the answer that costs the
point. One clause per metric fixes it permanently.

### 5. No decisions, only outcomes

Every case study answers _what I built_. None answers _what I considered and
rejected_. The material is already there and unwritten:

- CQRS on the ERP read path — why, and why not a simpler split
- RabbitMQ at Otokoç, Kafka on the TELCO CRM — the same problem, two answers
- Fabric notebooks in Python over the visual designer (hinted at, never argued)
- Django kept in production while .NET is built alongside it, rather than a cut-over

Each of these is a paragraph. Together they are the difference between a
builder and an engineer.

### 6. Nothing the reader can weigh independently

The homepage is `HeroSection` + `WorkSection` and nothing else. There is no
writing, no notes, no statement of how the work gets done. Every claim on the
site is self-assessment about private employer systems, and two of the three
strongest projects are closed-source by necessity. A reader has no way to
evaluate the thinking except by trusting the summary.

## The plan

Ordered by what a reader notices first, not by what is easiest. Phases 08, 09
and 10 reflect decisions taken after the audit — recorded in "Decisions taken"
below.

### 07 — Draw the systems

One diagram per production case study, placed above the prose.

- `travel-data-platform` — the five stages, with what crosses each boundary
- `telco-crm-platform` — nine bounded contexts and the events between them
- `erp-modernisation` — the strangler-fig shape: Framework and .NET 8 serving
  at once, and what moved when
- `property-management` — Django in production, .NET reporting path alongside
- `video-transcription-pipeline` — the queue and the stages
- `saas-ecommerce-platform`, `klauthed`, `scivex` — as their write-ups land

Built as inline SVG committed to the repo, using the existing theme tokens so
they work in light and dark and cost nothing at runtime. Not screenshots: a
diagram states the shape a screenshot hides, and it carries no disclosure risk
the prose does not already carry.

Doing this first is also what makes phase 08 worth building — a horizontal
panel with a diagram in it is worth stopping on; one with three lines of text
is a card that has been made wider.

### 08 — Make the scroll mean something

**Every project stays, including future ones.** The problem was never the
count; it was that 1700vh of vertical stacking gives a visitor no sense of
progress, so it reads as scrolling for its own sake.

Replace it with a horizontally travelling track driven by vertical scroll —
the page pins, the work moves sideways, and the reader is visibly moving
_through_ something rather than past it.

What makes this work rather than annoy:

- **Progress is always visible.** A position indicator and the panel count, so
  the reader knows how far in they are and how much is left. Scroll that hides
  its own length is what makes horizontal sections feel like a trap.
- **It scales past eight.** The track must not simply get longer forever. Panel
  width is capped and the section ends with a link to `/projects`, so the
  homepage stays a curated pass through everything rather than a full index —
  and adding a twentieth project does not add twenty screens of scroll.
- **Keyboard and touch are first-class.** Arrow keys move panel to panel, `Tab`
  reaches every card in order and scrolls it into view, touch gets native
  horizontal swipe rather than a hijacked vertical gesture.
- **Reduced motion gets a real layout**, not a broken one: a plain vertical
  list of the same cards, no pinning, no translation.
- **No scroll hijacking.** Vertical scrolling drives horizontal travel at a
  proportional rate and never traps the wheel; a reader who keeps scrolling
  always exits the section.

The interaction ideas already prototyped in `/lab/a` — rows that open in place,
metrics that count on arrival, the title marquee behind the live panel — are
the raw material for the panels themselves.

The honest risk to watch: horizontally scrolling sections are one of the more
commonly disliked patterns on the web, and almost always because of the five
points above rather than the direction of travel. Each is a requirement, not a
nice-to-have, and the section is not done until all five hold.

### 09 — One case-study structure, applied to all of them

Not a word-count floor — a **shape**, so every study answers the same questions
and a reader can compare two projects without re-learning the format:

| Beat              | What it answers                                                                   |
| ----------------- | --------------------------------------------------------------------------------- |
| **Goal**          | What the system had to do, in business terms, before any technology               |
| **Constraints**   | Team size, timeline, what was already in production, what could not change        |
| **Challenges**    | The two or three things that made it hard, specifically                           |
| **Decisions**     | What was chosen, what was rejected, and the reason it lost                        |
| **What I built**  | The implementation, briefly — this is the part already written                    |
| **Impact**        | The numbers, each with what was measured, over what window, against what baseline |
| **Retrospective** | What I would change, and what I took into the next project                        |

Applied everywhere, starting with the two thinnest — `saas-ecommerce-platform`
(97 words) and `video-transcription-pipeline` (170) — and rolled back through
the rest. The decisions beat is where most of the senior signal lives, and the
material already exists unwritten: CQRS on the ERP read path, RabbitMQ at
Otokoç against Kafka on the TELCO CRM, Fabric notebooks over the visual
designer, Django kept running while .NET is built beside it.

Two rules that come with it:

- **Every metric names its basis.** Where a number cannot be sourced, cut it —
  an unsourced metric is worth less than no metric, because it invites the
  question you cannot answer.
- **`travel-data-platform` gets metrics**, currently zero: pipelines, source
  systems integrated, refresh cadence, manual extracts retired.

The structure goes into `GUIDELINE.md` so it holds for projects added later.

### 10 — Publish thinking, not just outcomes

A `/notes` section with three pieces, drafted from work already done and
fact-checked by you before publishing:

1. Migrating an ERP module with no maintenance window
2. Watermarking ADF pipelines so a failed run resumes instead of replaying
3. Why the reporting layer is where ERP projects rot — the lesson already
   sitting in the `erp-modernisation` retrospective, argued properly

The strongest senior signal available and the only one entirely under your
control: it depends on no employer, title or public repo. The infrastructure —
mdsvex, the locale-aware loader, the frontmatter validator — works unchanged
for a second content type.

Its one cost is ongoing. Three good pieces beat eight thin ones, and a notes
section whose newest post is eighteen months old is worse than no notes
section, so the section carries a visible date and stays at three until there
is a fourth worth reading.

### 11 — How the work gets done

A short, opinionated page. Not values — specifics:

- What gets instrumented before a migration starts
- How a change reaches production, and how it comes back out
- What the first week on an unfamiliar system looks like
- What you decline to do, and why

Two hundred words of real position beats a page of adjectives, and this is
where limited years matter least: judgement is demonstrable at any length of
service.

### 12 — Craft, once the substance is there

- Reading time and a last-reviewed date on each study
- `prefers-reduced-data` handling for the canvas hero
- The remaining `/lab/a` interactions not already absorbed by phase 08

Deliberately last. Motion on a thin case study amplifies the thinness.

## Decisions taken

| Question                       | Decision                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Curate the homepage down to 4? | **No.** Keep every project, including future ones, and fix the presentation instead — phase 08         |
| The two thin case studies?     | **Write them properly**, on a structure that carries goal, challenges, decisions and impact — phase 09 |
| Build `/notes`?                | **Yes, three pieces**, drafted here and fact-checked before publishing — phase 10                      |

`featuredProjects()` still ignores the `featured` flag. With every project
staying on the homepage that is no longer costing anything, so the flag gets
removed rather than honoured — a field that means nothing is worse than no
field.

## Order of work

**07 first.** Diagrams close the biggest gap, need no new facts, and give
phase 08 something worth putting in a panel.

**Then 09**, which is mostly editing rather than authoring — the decisions were
made years ago and only need recording. It also settles what each card says
before the cards get rebuilt.

**Then 08**, with real content to present.

**Then 10 and 11**, which are new writing rather than revision, and 12 last.
