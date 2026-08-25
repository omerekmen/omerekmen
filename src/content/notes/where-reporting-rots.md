---
title: The reporting layer is where these projects rot
slug: where-reporting-rots
date: 2026-08-22
summary: 'Reading reports straight off the transactional schema is right for the first ten and quietly wrong by the fortieth, because each report is a fresh set of assumptions about the same tables. The cost is not performance — it is that nobody can say which number is correct.'
tags:
  - data-modelling
  - reporting
  - architecture
related: erp-modernisation
---

Three systems I have worked on made the same choice, and I would make it again
in at least two of them: reports read directly from the transactional tables. No
modelled reporting layer, no conformed dimensions, no separate schema. The
report is a query.

For the first ten reports this is obviously correct. A modelled layer is real
work, it buys nothing until there is enough history and enough reports to strain
the transactional shape, and building one early means designing for a load
pattern nobody has demonstrated yet.

The problem is that the point where it stops being correct does not announce
itself, and by the time it does the cost of fixing it has grown with every
report written in the meantime.

## The cost is not what people expect

The first thing everyone notices is speed. A dashboard aggregates the full
history on every load, gets slower as the history grows, and eventually somebody
is asked to make it fast. On one system that was a query restructuring and an
indexing pass, and it cut the load time by around 60% — enough that the question
went away for another year.

That fix is real, and it is also a deferral. The performance problem was never
the expensive one.

The expensive one is that **each report is an independent set of assumptions
about the same tables.** Report 4 decides an approved purchase is one where
`status = 'A'`. Report 19, written eight months later by someone else, decides
it also has to have an approval date, because the author saw a row where it did
not. Report 33 excludes cancelled ones. All three are defensible readings of the
same schema. None of them is written down anywhere except in its own SQL.

Nothing breaks. Every report runs. They disagree, and each is confident.

## How it surfaces

It surfaces as a meeting. Finance has a number, purchasing has a different
number, both are from "the system", and the person who can adjudicate is
whoever is willing to read forty queries. That person becomes a dependency, and
the honest cost of the architecture is their calendar.

The second symptom is that new reports get slower to write over time. Not
because the queries get harder, but because the responsible thing to do before
writing report 41 is to check how the previous forty defined the thing you are
about to define — and nobody does that, so instead report 41 adds a
forty-first definition. The cost per report rises and no individual report is to
blame.

## What a modelled layer actually fixes

It is easy to talk about conformed dimensions as though the benefit is
performance or tidiness. It is neither. The benefit is that **"an approved
purchase" is defined exactly once, in a place that has a name.**

After that, a disagreement between two reports is a bug with a location. Before
it, a disagreement is an argument.

Everything else — the star schema, the pre-aggregation, the separation of read
load from write load — is downstream of that, and none of it is why the layer is
worth building.

## When to pay

Not at report ten. Probably not at report twenty. The signals I would now watch
for, in rough order of how early they appear:

**The same business term appears in more than one query with more than one
definition.** This is the actual trigger, and it is checkable — grep the
reports for the term and read the `where` clauses. If they differ and nobody
decided they should, you are past the point.

**A report is written by copying another report.** Copying is how definitions
propagate without being agreed, and it is the mechanism by which the fortieth
report inherits a filter whose reason nobody remembers.

**Someone asks which number is right.** By this point you are late, but it is
still the cheapest moment left, because there is now a concrete disagreement to
model around rather than a hypothetical one.

## What I would do differently

Not build the modelled layer earlier — I still think that is premature on a
system with a handful of reports.

What I would do is write the definitions down from the first report, in plain
language, next to the schema. Not a semantic layer, not a tool: a file that says
what an approved purchase is, what an active tenancy is, what counts as revenue
in a month. It costs an afternoon, it does not constrain the implementation, and
it means that when the modelled layer finally is worth building, the hard part —
agreeing what the words mean — is already done.

Every version of this I have seen skipped that file, and every version paid for
it in the same currency: not slow reports, but a room full of people who cannot
agree which number is true.
