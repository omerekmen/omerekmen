---
title: Video Transkripsiyon ve Çeviri Hattı
slug: video-transcription-pipeline
track: production
role: Tek geliştirici — akademik bir müşteri için geliştirildi
period: '2025'
summary: Videoyu deşifre edip sonucu birden çok dile çeviren, yapılandırılabilir bir CLI olarak kurgulanmış ve üretimde çalışan Python otomasyon hattı.
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

## Problem

Akademik bir müşterinin, büyüyen bir kayıt arşivi için birden çok dilde deşifre
ve altyazıya ihtiyacı vardı. Bunu elle yapmak ölçeklenmiyor; uçtan uca yapan
ticari servisler ise dakika başına ücretlendiriliyor.

## Mimari

Her adımı bağımsız olarak yeniden çalıştırılabilen aşamalı bir hat; böylece
zincirin sonundaki bir hata, pahalı adımların baştan çalışmasını gerektirmiyor:

1. **Çıkarma** — FFmpeg ses izini alıp normalleştirir
2. **Deşifre** — Whisper zaman damgalı bir metin üretir
3. **Çeviri** — DeepL metni hedef dillere aktarır
4. **Çıktı** — dil başına altyazı ve metin dosyaları

## Ne geliştirdim

Hattın tamamı; müşterinin kod değiştirmeden yeni materyale yönlendirip hedef dil
seçebilmesi için yapılandırılabilir bir CLI olarak sunuldu.

## Geriye dönüp baktığımda

Aşamalar diskteki dosyalar üzerinden haberleşiyor; bu basit ve hata ayıklaması
kolay ama eşzamanlılığı zorlaştırıyor. Daha büyük bir arşivde doğal sonraki adım,
deşifre ve çevirinin öğeler arasında paralel çalışabilmesi için bir iş kuyruğu.
