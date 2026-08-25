---
title: Watermarking a pipeline so a failed run resumes instead of replaying
slug: watermarks-not-reloads
date: 2026-08-11
summary: 'Full reloads are simple and always correct, which is why they are the default and why a nightly load becomes a daily incident. Watermarks fix the cost and hand you a new problem: the pipeline now owns state, and state can be wrong.'
tags:
  - data-engineering
  - Azure Data Factory
  - Microsoft Fabric
related: travel-data-platform
---

The first version of almost every pipeline reloads everything. It is the right
first version. It is simple, it has no state, and it is correct by construction:
whatever the source says now is what the warehouse says next.

It stops being right at a size that is easy to predict and easy to ignore. When
the source has two years of history and yesterday changed, a full reload spends
its entire budget re-reading the part that did not change. The visible symptom
is not slowness — it is that a failure at minute fifty costs you all fifty
minutes, so a single bad night turns into a morning of catching up while the
next scheduled run is already queuing behind it.

## What a watermark actually is

A watermark is a claim: _everything up to here has been loaded._ You store it,
you read it at the start of a run, you pull only what is newer, and you advance
it when the run succeeds.

That is the whole idea, and every difficulty in it comes from the word
"newer".

**Newer by what clock?** If it is the source system's clock, you are trusting a
machine you do not control to be monotonic. If it is the pipeline's clock, you
will miss rows that were written to the source before your run started but
committed after. Neither is wrong in general; what is wrong is not knowing which
one you picked.

**Newer by which column?** A `modified_at` maintained by the application is
usually the best answer available and is only as good as the code paths that
maintain it. The one that gets missed is always the bulk update — someone
corrects ten thousand rows with a script, the column does not move, and the
warehouse never learns. It is not a pipeline bug, and the pipeline is where it
surfaces.

**What about deletes?** A row that is gone is not newer than anything. If the
source hard-deletes, an incremental load cannot see it, and the warehouse keeps
a record the business believes it removed. Either the source soft-deletes, or
you need a periodic reconciliation pass, or you accept the drift knowingly. The
third is a legitimate option; the failure is picking it accidentally.

## The state you just took on

A full reload has no memory, and that is its virtue. The moment you watermark,
the pipeline holds state, and that state can be wrong in ways the data does not
reveal.

The dangerous case is an advanced watermark with a failed load. If the run
advances the mark before the write is durable, the rows in between are gone —
not corrupted, not late, simply never loaded, and nothing downstream will look
wrong. It will look like a quiet week in the source data.

Two rules make this survivable, and they are not sophisticated:

**Advance the watermark last, and only on success.** Land the data, verify the
write, then move the mark. If the run dies, the mark did not move and the next
run redoes a window it already did. Reprocessing a window twice is a problem you
can solve with idempotent writes. Skipping one is a problem you find out about
in a board report.

**Overlap the window.** Read from slightly before the watermark rather than
exactly at it. Late-committing rows and clock skew are both bounded in practice,
and a small overlap costs a little duplicated work in exchange for not losing
the rows in that boundary. It only works if the write is idempotent, which is
the real requirement hiding behind both rules.

## Making the write idempotent

Everything above depends on being able to load the same window twice without
doubling anything. In practice that means the target has a key it can merge on,
and the load is an upsert rather than an append.

This is worth doing before the watermark, not after. A pipeline with a watermark
and a non-idempotent write is more fragile than the full reload it replaced,
because it has taken on state without earning the right to retry.

## When not to bother

If the source is small enough that a full reload finishes comfortably inside its
window, keep the full reload. It has no state, no clock question, no delete
problem and no watermark to be wrong. The engineering time is better spent on
the thing downstream that people actually argue about.

The signal to switch is not size. It is the first time a failure costs more than
the run itself — when re-running is expensive enough that someone decides to
skip a night rather than pay for it. That is the moment the pipeline stopped
being cheap to retry, and retrying cheaply is the property worth buying.
