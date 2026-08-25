---
title: Video Transcription & Translation Pipeline
slug: video-transcription-pipeline
track: production
role: Sole engineer — delivered for an academic client
period: '2025'
summary: A Python automation pipeline that transcribes video and translates the result into multiple languages, built as a configurable CLI so an academic client can run it themselves against a growing archive.
stack:
  - Python
  - FFmpeg
  - OpenAI Whisper
  - DeepL API
domains:
  - data-engineering
  - automation
metrics: []
links:
  github: null
  demo: null
featured: true
confidential: false
order: 90
---

## The problem

An academic client had a growing archive of recorded material that needed
transcripts and subtitles in several languages. Doing it by hand does not scale.
The commercial services that do it end to end are priced per minute of audio,
which turns a one-off backlog into a recurring bill that grows with the archive
rather than with the work.

## Constraints

One engineer, and a client with no infrastructure team. Whatever was built had
to be something a researcher could run — not a service to operate, not a
deployment to keep alive, and not something that broke the first time the input
was an unusual container format.

## What made it hard

The expensive step is in the middle. Transcription costs real compute time, and
it sits behind audio extraction and in front of translation. A pipeline that
treats the whole run as one unit makes a DeepL rate-limit at the end pay for
transcription again at the start — which, on a long recording, is the difference
between a retry and an afternoon.

## Decisions

**Self-hosted Whisper over a per-minute transcription API.** The commercial
option is faster to integrate and has no compute to think about. It also prices
the archive rather than the work: every re-run, every corrected pass, every
newly added language costs again. Running Whisper moves the cost from per-minute
billing to compute the client already has, and the trade accepted in exchange is
that transcription quality is now something I own rather than something I buy.

**Files on disk between stages, not an in-process pipeline.** Every stage reads
files and writes files, so any stage can be re-run alone, its output inspected
by hand, and a failure diagnosed by looking at what the previous step actually
produced. It is the least clever option available and it is the reason a failure
in translation costs minutes instead of hours.

**DeepL for translation, not a general-purpose model.** The material is European
languages and the requirement is faithful rather than fluent — an academic
transcript that reads well but drifts from what was said is worse than a stiff
one that does not.

**A CLI, not a service.** A web service would have been nicer to use and would
have needed hosting, authentication, monitoring and someone to care about all
three. The client needed to point a tool at a folder.

## What I built

The whole pipeline end to end: audio extraction and normalisation with FFmpeg,
transcription through Whisper, translation through the DeepL API, and subtitle
and transcript output per language — exposed as a configurable CLI so new
material and new target languages need no code change.

## Impact

In production with the client, run against their archive without me. The
structural outcome is the one worth stating: the cost of transcribing the
archive stopped scaling with its length, because the recurring per-minute charge
was replaced by compute the client already pays for.

## What I'd change

The same choice that makes the stages debuggable makes concurrency awkward —
files on disk are a fine interface and a poor scheduler. Given a larger archive,
the next step is a work queue so transcription and translation run in parallel
across items rather than one recording at a time. I would still not start there:
the sequential version is what made the failure modes obvious enough to know
where the queue belongs.
