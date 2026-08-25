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

Ordered by what a reader notices first, not by what is easiest.

### 07 — Draw the systems

One diagram per production case study, placed above the prose.

- `travel-data-platform` — the five stages, with what crosses each boundary
- `telco-crm-platform` — nine bounded contexts and the events between them
- `erp-modernisation` — the strangler-fig shape: Framework and .NET 8 serving
  at once, and what moved when
- `property-management` — Django in production, .NET reporting path alongside
- `video-transcription-pipeline` — the queue and the stages

Built as inline SVG committed to the repo, using the existing theme tokens so
they work in light and dark and cost nothing at runtime. Not screenshots: a
diagram states the shape a screenshot hides, and it carries no disclosure risk
the prose does not already carry.

**Unlocks the largest perceived gap for the least content work.**

### 08 — Set a floor, then curate

Two changes that work together:

1. Bring every production case study to a floor of roughly 300 words on the
   same beats — problem, what I chose, what it cost, what I would change.
   `saas-ecommerce-platform` (97) and `video-transcription-pipeline` (170) are
   the ones below it.
2. Make `featured` actually mean something: have `featuredProjects()` read the
   flag, and cut the homepage stack to the four that carry the argument. The
   rest stay on `/projects`, which is what an index is for.

Side effect: the homepage scroll drops from 1700vh to around 940vh.

### 09 — Show the reasoning

- A **"What I considered"** beat in each production study — the alternative,
  and the specific reason it lost. Two to four sentences, not an essay.
- **Methodology on every metric.** What was measured, over what window, against
  what baseline. Where a number cannot be sourced, cut it: an unsourced metric
  is worth less than no metric, because it invites the question you cannot
  answer.
- Metrics for `travel-data-platform`, currently zero — pipeline count, source
  systems integrated, refresh cadence, extracts retired. All disclosable.

### 10 — Publish thinking, not just outcomes

A `/notes` section, three or four pieces, drawn from work already done:

- Migrating an ERP module with no maintenance window
- Watermarking ADF pipelines so a failed run resumes instead of replaying
- Why the reporting layer is where ERP projects rot — the lesson already sitting
  in the `erp-modernisation` retrospective, argued properly
- What a governed model is actually for, in terms of arguments it prevents

This is the strongest available senior signal and the only one entirely under
your control: it does not depend on an employer, a title, or a public repo. The
infrastructure exists — mdsvex, the locale-aware content loader and the
frontmatter validator all work unchanged for a second content type.

It is also the only item here with an ongoing cost. Three good pieces beat
eight thin ones, and a notes section with one post from eighteen months ago is
worse than no notes section.

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

- Harvest the `/lab/a` interactions into the live site — the work index that
  opens in place, metrics that count on arrival, the case-study contents rail
- Reading time and a last-reviewed date on each study
- `prefers-reduced-data` handling for the canvas hero

Deliberately last. Motion on a thin case study amplifies the thinness.

## Where I would start

**07 and the `featured` half of 08, in that order.** Diagrams close the biggest
gap and need no new facts; fixing `featured` is a small change that removes the
weakest page from the front of the site and cuts the homepage scroll almost in
half. Together they change the first impression without waiting on any writing.

Then 09, which is editing rather than authoring — the decisions were made years
ago and only need recording.

10 is the highest ceiling and the highest ongoing cost, and it is the one worth
deciding deliberately rather than drifting into.
