---
title: Migrating an ERP module with no maintenance window
slug: migrating-without-a-window
date: 2026-07-14
summary: 'A cut-over puts an accounting close at the mercy of a release date. Running the old and new systems in parallel costs more and takes longer, and it is the version where no operational day depends on you being finished.'
tags:
  - migration
  - .NET
  - production
related: erp-modernisation
---

The plan everyone reaches for first is a cut-over. Build the replacement, pick a
weekend, move the traffic, keep the old system around for a fortnight in case
something goes wrong. It is the cheapest plan on paper and the only one that
finishes on a date you can put in a slide.

It also means that on one specific Saturday, a system people use to close the
month has to work correctly the first time, in an environment it has never seen
production traffic in, with the team that built it awake and the team that
depends on it asleep. Every migration story that ends badly ends there.

The alternative is to run both. It is slower, it costs more, and it is what we
did for the accounting and purchasing modules of an ERP that people used every
working day.

## What "both" actually means

Parallel running is easy to say and specific to implement. Three things have to
be true before it works at all.

**There has to be a seam.** Something in front of both systems that can send a
given request to one or the other. In a monolith there is usually no such
place — the screens call the code directly — so the first work of the migration
is not writing any new code at all. It is creating the boundary that will later
let you move things across it.

**The seam has to be small enough to reason about.** If the routing decision
depends on the request, the user, the time of month and a feature flag, nobody
can say with confidence which system served a given transaction. When something
is wrong six weeks in, that question is the entire investigation. A seam you
cannot answer it from is worse than no seam, because it produces confident
wrong answers.

**Both systems have to agree about state.** This is the part people
underestimate. Two services can serve the same screen, but if they hold their
own idea of what an approved purchase order is, you have not migrated anything —
you have built a second system that disagrees with the first, and you will find
out which one is right from an accountant.

For us that meant the new .NET services and the old Framework monolith wrote to
the same SQL Server, and a good deal of the logic that decided what was true
lived in stored procedures next to the data rather than in either application.
That is a choice with real costs — logic in two places, a schema that is now a
contract between two runtimes — and it is what made the parallel period safe.

## What you give up

The honest cost is duplicated behaviour and the discipline of keeping both
correct.

Every rule that exists in the old module and the new one is a rule that can
drift. Somebody fixes a rounding case in the new service, and the old path keeps
rounding the old way for another month, and both are live. There is no clever
architecture that removes this. What removes it is deciding, per rule, which
system owns it — and being willing to say "the old one, for now" more often than
feels good.

You also give up the satisfying moment. A cut-over has a day when it is done. A
parallel migration has a long tail of increasingly boring paths, and the last
ten per cent takes longer than the first fifty, because what is left is the
things nobody understood well enough to move early. If you need the project to
feel finished, this will be uncomfortable. If you need the month-end close to
work, it is the right trade.

## What it buys

**No operational day depends on the migration.** This is the whole argument. If
the new service is wrong on a Tuesday, the old path still exists on Tuesday.
That single property changes what the team is willing to attempt: you can move a
risky module early, because being wrong about it is recoverable in minutes
rather than in an incident.

**Failures arrive one at a time.** In a cut-over every unknown lands on the same
weekend, and they interact. Moving one path at a time means each surprise
arrives alone, with the rest of the system stable around it, which is the
difference between debugging and archaeology.

**The rollback is not a plan, it is the current state.** Nobody has to
successfully execute a rollback procedure written six months earlier by someone
who has since left. Reverting is a routing change.

## What I would tell someone starting one

Build the seam before you write a line of the replacement. It is unglamorous,
it produces no visible progress, and everything after it depends on it existing.

Move the boring path first, not the interesting one. The instinct is to prove
the new architecture on the hardest module. The reason to do the opposite is
that the first path you move is not really a test of the new system — it is a
test of the seam, the deployment, the monitoring and the team's ability to tell
which system served a request. Learn that on something where being wrong is
cheap.

Write down which system owns each rule, somewhere that is not a person's head.
The drift problem above is not solved by intention.

And keep the old system's support alive longer than feels necessary. The
temptation to declare it dead grows as the new one gets good, and the cost of
being early is that you find out about the last unmigrated path from the people
who needed it.
