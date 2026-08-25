---
title: Video Transkripsiyon ve Çeviri Hattı
slug: video-transcription-pipeline
track: production
role: Tek geliştirici — akademik bir müşteri için geliştirildi
period: '2025'
summary: Videoyu deşifre edip sonucu birden çok dile çeviren; akademik bir müşterinin büyüyen arşivi üzerinde kendi başına çalıştırabilmesi için yapılandırılabilir bir CLI olarak kurgulanmış Python otomasyon hattı.
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

Akademik bir müşterinin, birkaç dilde transkript ve altyazı gerektiren, büyüyen
bir kayıt arşivi vardı. Bunu elle yapmak ölçeklenmiyor. Uçtan uca yapan ticari
servisler ise ses dakikası başına fiyatlanıyor; bu da tek seferlik bir birikmiş
işi, iş miktarıyla değil arşiv uzunluğuyla büyüyen tekrarlayan bir faturaya
dönüştürüyor.

## Kısıtlar

Tek mühendis ve altyapı ekibi olmayan bir müşteri. Kurulan şeyin bir
araştırmacının çalıştırabileceği bir şey olması gerekiyordu — işletilecek bir
servis değil, ayakta tutulacak bir dağıtım değil ve girdi alışılmadık bir kapsayıcı
biçimi olduğunda ilk seferde kırılan bir şey hiç değil.

## Zor olan neydi

Pahalı adım ortada. Deşifre gerçek işlem zamanı harcıyor ve ses çıkarmanın
arkasında, çevirinin önünde duruyor. Tüm koşuyu tek parça sayan bir hat, sonda
alınan bir DeepL hız sınırının bedelini baştaki deşifreye yeniden ödetiyor — uzun
bir kayıtta bu, bir yeniden denemeyle bir öğleden sonranın farkı.

## Kararlar

**Dakika başına ücretlendirilen bir API yerine kendi sunucumuzda Whisper.**
Ticari seçeneği entegre etmek daha hızlı ve düşünülecek bir işlem yükü yok. Aynı
zamanda işi değil arşivi fiyatlandırıyor: her yeniden koşu, her düzeltme geçişi,
sonradan eklenen her dil yeniden ödetiyor. Whisper'ı çalıştırmak maliyeti dakika
başı faturadan müşterinin zaten sahip olduğu işlem gücüne taşıyor; karşılığında
kabul edilen takas ise deşifre kalitesinin artık satın aldığım değil sahiplendiğim
bir şey olması.

**Aşamalar arasında süreç içi bir hat değil, diskteki dosyalar.** Her aşama dosya
okuyup dosya yazıyor; böylece herhangi bir aşama tek başına yeniden
çalıştırılabiliyor, çıktısı elle incelenebiliyor ve bir hata bir önceki adımın
gerçekte ne ürettiğine bakılarak teşhis edilebiliyor. Mevcut seçenekler içinde en
az kurnaz olanı — ve çeviride çıkan bir hatanın saatler değil dakikalar
tutmasının sebebi.

**Çeviri için genel amaçlı bir model değil, DeepL.** Malzeme Avrupa dilleri ve
gereksinim akıcı olmaktan çok sadık olmak — iyi okunan ama söylenenden uzaklaşan
akademik bir transkript, uzaklaşmayan sert bir transkriptten daha kötüdür.

**Servis değil, CLI.** Bir web servisi kullanımı daha hoş olurdu; barındırma,
kimlik doğrulama, izleme ve bu üçünü önemseyecek birini de gerektirirdi. Müşterinin
ihtiyacı bir aracı bir klasöre yöneltmekti.

## Ne inşa ettim

Hattın tamamı: FFmpeg ile ses çıkarma ve normalleştirme, Whisper ile deşifre,
DeepL API ile çeviri ve dil başına altyazı ile transkript çıktısı — yeni
malzemenin ve yeni hedef dillerin kod değişikliği gerektirmemesi için
yapılandırılabilir bir CLI olarak sunuldu.

## Etki

Müşteride üretimde; arşivleri üzerinde ben olmadan çalışıyor. Söylemeye değer
olan yapısal sonuç: arşivi deşifre etmenin maliyeti uzunluğuyla ölçeklenmeyi
bıraktı, çünkü tekrarlayan dakika başı ücretin yerini müşterinin zaten ödediği
işlem gücü aldı.

## Neyi değiştirirdim

Aşamaları hata ayıklanabilir kılan tercih, eşzamanlılığı da zorlaştırıyor —
diskteki dosyalar iyi bir arayüz, kötü bir zamanlayıcıdır. Daha büyük bir arşivde
sıradaki adım, deşifre ve çevirinin tek kayıt yerine kalemler arasında paralel
çalışması için bir iş kuyruğu. Yine de oradan başlamazdım: kuyruğun nereye ait
olduğunu bilecek kadar hata biçimlerini belirgin kılan şey, sıralı sürümün ta
kendisiydi.
