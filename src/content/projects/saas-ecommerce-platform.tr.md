---
title: SaaS E-Ticaret Platformu
slug: saas-ecommerce-platform
track: production
role: Backend mühendisi — 4 kişilik ekip
period: Ara 2023 — Şub 2025
summary: Kimlik doğrulama, ürün, sipariş ve müşteri süreçleriyle raporlama uçlarını kapsayan, sistem tasarımından bulut dağıtımına kadar götürülmüş Django backend ve yönetim platformu.
stack:
  - Python
  - Django
  - PostgreSQL
  - REST API
  - AWS (EC2, S3)
  - CI/CD
domains:
  - backend
metrics: []
links:
  github: null
  demo: null
featured: false
confidential: false
order: 80
---

## Problem

Ödeme yapan bir müşterinin, kendi işletebileceği bir ticaret platformuna ihtiyacı
vardı — katalog, siparişler, müşteriler ve bu üçünü anlamayı sağlayan raporlama.
Kontrol edemediği barındırılan bir servise iliştirilmiş bir vitrin değil.

## Mimari

REST uçları sunan bir Django backend ve aynı alan modeli üzerinde çalışan bir
yönetim platformu. Kimlik doğrulama, ürün, sipariş ve müşteri süreçleri ayrı
sorumluluklar olarak modellendi; raporlama uçları bunların üzerine kondu. AWS
üzerinde CI/CD ile dağıtıldı.

## Ne geliştirdim

Dört kişilik bir ekibin parçası olarak backend mimarisi ve uygulaması; sistem
tasarımından bulut dağıtımına kadar.
