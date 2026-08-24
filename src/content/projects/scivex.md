---
title: Scivex
slug: scivex
track: in-progress
role: Sole engineer — open source
period: 2025 — present
summary: A scientific computing library in Rust, built as a Cargo workspace with numerical primitives implemented from first principles rather than bound to existing C or Fortran libraries.
stack:
  - Rust
  - Cargo workspace
domains:
  - data-engineering
  - systems
metrics: []
links:
  github: https://github.com/scivex/scivex
  demo: null
featured: true
confidential: false
order: 60
progress: In development — API not yet stable
---

## The problem

Rust's numerical ecosystem is capable but fragmented, and most of it ultimately
binds to the same C and Fortran libraries the Python stack uses. Scivex is an
attempt at the other approach: implement the primitives in Rust, from the
mathematics up, and see how far that gets.

## Architecture

A Cargo workspace of focused crates — tensors and n-dimensional arrays,
dataframes, linear algebra, and the numerical routines built on them. The
constraint the project sets itself is no external math dependencies: the linear
algebra and transform routines are written from their mathematical definitions.

That constraint is the point. It is also the reason this is slower going than a
binding layer would be.

## Status

**In development, API not yet stable.** The repository is public and the work is
visible there.

## What I've learned so far

Writing numerical routines from their definitions makes you confront how much of
a mature library's value is in the edge cases — conditioning, overflow, the
degenerate inputs. Getting the happy path right is the first ten percent.
