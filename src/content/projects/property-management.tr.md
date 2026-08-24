---
title: Emlak Yönetim Platformu
slug: property-management
track: production
role: Backend mühendisi — 2 kişilik ekip, Nesin Vakfı için geliştirildi
period: Ara 2023 — Şub 2025
summary: Bir matematik eğitimi vakfı için 100'den fazla mülk kaydını yöneten, kira, gider ve kiracı süreçlerini normalleştirilmiş bir PostgreSQL şeması üzerinde raporlayan Django platformu.
stack:
  - Python
  - Django
  - PostgreSQL
  - REST API
  - AWS (EC2, S3)
  - CI/CD
domains:
  - backend
  - data-engineering
metrics:
  - { label: Mülk kaydı, value: '100+' }
  - { label: Normalleştirilmiş tablo, value: '15+' }
  - { label: Panel yüklenme süresi, value: '-60%' }
links:
  github: null
  demo: null
featured: true
confidential: false
order: 95
---

## Problem

Nesin Vakfı, Türkiye'de matematik eğitimini kısmen bir mülk portföyünden gelen
kira geliriyle finanse ediyor. Bu portföy elektronik tablolarla takip ediliyordu:
kira vadeleri, kiracı kayıtları, bakım giderleri ve bunları birbirine bağlayan
aylık mutabakat. Buradaki hata biçimi sessizdir — kaçırılan bir yenileme ya da
kaydedilmemiş bir gider hiçbir yerde kendini göstermez.

## Mimari

Mülkleri, kira sözleşmelerini, ödeme planlarını, gider kategorilerini ve
aralarındaki mutabakatı modelleyen, 15'ten fazla normalleştirilmiş tablodan oluşan
bir PostgreSQL şeması üzerinde Django backend. AWS üzerinde CI/CD ile dağıtıldı.

## Ne geliştirdim

Backend mimarisi ve uygulaması, veritabanı şeması, raporlama uçları ve dağıtım
hattı — gereksinim analizinden üretime kadar, iki kişilik bir ekibin parçası
olarak.

## Sonuç

Raporlama paneli sistemdeki en yavaş yüzeydi, çünkü her açılışta tüm geçmiş
üzerinden toplama yapıyordu. Sorguların yeniden yapılandırılması ve düşünülmüş
bir indeksleme stratejisi yüklenme süresini %60 azalttı.

## Nereye gidiyor

Platform üretimde Django üzerinde çalışıyor. Şu anda backend'i .NET ile yeniden
yazıyorum; asıl sebep raporlama tarafı — ilk zorlanan yer toplamalar ve tipli,
derlenen bir sorgu katmanı bu noktada ORM'in bu ölçekte verdiğinden daha fazla
optimizasyon alanı bırakıyor.

Bu yeniden yazım devam ediyor; gerçek kullanıcılara hizmet veren sürüm Django
sürümü.

## Geriye dönüp baktığımda

Raporlama katmanı doğrudan işlem şemasından okuyor. Bu ölçekte doğru bir başlangıç
noktası, ancak ilk zorlanacak yer toplamalar olacak — yazma anında tazelenen
materyalize bir raporlama görünümü, sorun hâline gelmeden yükü üzerinden alırdı.
