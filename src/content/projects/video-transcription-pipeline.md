---
title: Video Transcription & Translation Pipeline
slug: video-transcription-pipeline
track: production
role: Sole engineer — delivered for an academic client
period: '2025'
summary: A Python automation pipeline that transcribes video and translates the result into multiple languages, built as a configurable CLI and deployed in production.
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
transcripts and subtitles in several languages. Doing it by hand does not scale,
and the commercial services that do it end to end are priced per minute.

## Architecture

A staged pipeline, each step independently re-runnable so a failure late in the
chain does not force a re-run of the expensive parts:

1. **Extract** — FFmpeg pulls and normalises the audio track
2. **Transcribe** — Whisper produces a timestamped transcript
3. **Translate** — DeepL renders the transcript into target languages
4. **Emit** — subtitle and transcript files per language

## What I built

The whole pipeline, exposed as a configurable CLI so the client can point it at
new material and pick target languages without touching code.

## What I'd change

The stages communicate through files on disk, which is simple and debuggable but
makes concurrency awkward. Given a larger archive, the natural next step is a
work queue so transcription and translation can run in parallel across items.
