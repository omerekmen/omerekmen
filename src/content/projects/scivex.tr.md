---
title: Scivex
slug: scivex
track: in-progress
role: Tek geliştirici — açık kaynak
period: 2025 — devam ediyor
summary: Rust ile yazılan bilimsel hesaplama kütüphanesi; sayısal temelleri mevcut C ya da Fortran kütüphanelerine bağlanmak yerine matematiksel tanımlarından uygulayan bir Cargo çalışma alanı.
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
progress: Geliştiriliyor — API henüz kararlı değil
---

## Problem

Rust'ın sayısal ekosistemi yetkin ama parçalı ve büyük bölümü nihayetinde Python
yığınının kullandığı aynı C ve Fortran kütüphanelerine bağlanıyor. Scivex diğer
yaklaşımı deniyor: temel yapıtaşlarını Rust içinde, matematiğinden başlayarak
uygulamak ve bunun nereye kadar gittiğini görmek.

## Mimari

Odaklı crate'lerden oluşan bir Cargo çalışma alanı — tensörler ve n-boyutlu
diziler, veri çerçeveleri, lineer cebir ve bunların üzerine kurulu sayısal
rutinler. Projenin kendine koyduğu kısıt, dış matematik bağımlılığı
kullanmamak: lineer cebir ve dönüşüm rutinleri matematiksel tanımlarından
yazılıyor.

Bu kısıt işin özü. Aynı zamanda ilerlemenin bir bağlama katmanına göre neden daha
yavaş olduğunun da sebebi.

## Durum

**Geliştiriliyor, API henüz kararlı değil.** Depo herkese açık ve çalışma orada
görülebilir.

## Şimdiye kadar öğrendiklerim

Sayısal rutinleri tanımlarından yazmak, olgun bir kütüphanenin değerinin ne
kadarının uç durumlarda olduğunu yüzünüze vuruyor — koşullandırma, taşma,
dejenere girdiler. Mutlu yolu doğru yapmak işin ilk yüzde onu.
