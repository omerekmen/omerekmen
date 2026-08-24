---
title: SpaceX Falcon 9 Landing Prediction
slug: spacex-falcon9
track: archive
role: Sole author — IBM Data Science capstone
period: '2023'
summary: Classification models predicting Falcon 9 first-stage landing success from launch telemetry, with an end-to-end pipeline from API collection through feature engineering to cross-validated evaluation.
stack:
  - Python
  - Scikit-Learn
  - Pandas
  - NumPy
  - Folium
  - Plotly
domains:
  - machine-learning
  - data-analysis
metrics:
  - { label: Accuracy, value: '85%' }
links:
  github: https://github.com/omerekmen/Space-X-Falcon-9-Landing-Analysis
  demo: null
featured: false
confidential: false
order: 20
---

## Overview

The capstone project for the IBM Data Science Professional Certificate.
Falcon 9 first-stage recovery is what makes the launch economics work, so
predicting whether a given launch will land successfully is a reasonable proxy
for predicting its cost.

## What I built

An end-to-end pipeline: collection from the SpaceX API, cleaning, feature
engineering, then Logistic Regression, SVM, Decision Tree and KNN classifiers
compared under cross-validation, reaching 85% accuracy. Landing sites and
outcomes are visualised geospatially with Folium and Plotly.

## Why it's archived

This is 2023 coursework, kept because the analysis stands on its own and the
repository is public. It is not representative of what I work on now.
