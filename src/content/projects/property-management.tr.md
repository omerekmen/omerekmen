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

## Kısıtlar

İki mühendis ve alternatifi zaten ellerinde olan tablolar olan bir müşteri. Bu
zorlu bir eşik koyuyor: yalnızca doğru olan bir sistem, tanıdık olan bir tabloya
yenilir. Aylık mutabakatı yapan kişi için ilk çeyrekte değil ilk gün daha hızlı
olması gerekiyordu.

## Zor olan neydi

Para mutabakatta, en zor modelleme de orada. Tahakkuk eden kira, tahsil edilen
kira, bir mülke ait bir gider ve hepsinin ait olduğu ay; dört ayrı zamanda gelen
ve bunları tek bir olay olarak düşünen insanlar tarafından girilen dört ayrı
olgudur. Birlikte geldiklerini varsayan bir şema gerçekliği kaydedemeyen bir
sistem üretir; hiçbir şey varsaymayan bir şema ise kimsenin rapor alamayacağı
bir sistem.

## Kararlar

**Tablo biçimli değil, normalize bir şema.** Müşterinin zihnindeki model bir
avuç sayfayken on beşten fazla tablo. Başlangıçta ve anlatımda daha pahalı — ve
"geçen yıl bu mülke hangi giderler işlendi" sorusunun bir arkeoloji çalışması
değil bir sorgu olduğu tek sürüm.

**Şemayla aynı sebeple Django.** İki kişilik bir ekibin yönetim panelinin,
ORM'in ve migration'ların kurulması değil çerçeveyle birlikte gelmesi
gerekiyordu. Takas şu: sorgu şeklini elle geri alana kadar ORM belirliyor — ki
aşağıda görüleceği gibi raporlama katmanında tam olarak bu oldu.

**Raporlama modelinden önce sorgu ve indeks çalışması.** Panel yavaşladığında
seçenek ya modellenmiş bir raporlama katmanıydı ya da mevcut sorgu ve
indekslerin ekranın gerçekte nasıl okuduğuna uydurulmasıydı. İkincisi daha
küçük, geri alınabilir ve bu ölçekte yeterli — ve bir çözüm değil, bir erteleme.

## Mimari

Mülkleri, kira sözleşmelerini, ödeme planlarını, gider kategorilerini ve
aralarındaki mutabakatı modelleyen, 15'ten fazla normalleştirilmiş tablodan oluşan
bir PostgreSQL şeması üzerinde Django backend. AWS üzerinde CI/CD ile dağıtıldı.

## Ne geliştirdim

Backend mimarisi ve uygulaması, veritabanı şeması, raporlama uçları ve dağıtım
hattı — gereksinim analizinden üretime kadar, iki kişilik bir ekibin parçası
olarak.

## Etki

Raporlama paneli sistemdeki en yavaş yüzeydi, çünkü her açılışta tüm geçmiş
üzerinden toplama yapıyordu. Sorguların yeniden yapılandırılması ve düşünülmüş
bir indeksleme stratejisi yüklenme süresini %60 azalttı.

Bu rakam, panel yükleme süresinin sorgu ve indeks çalışmasından önceki ve
sonraki hâli; aynı portföy üzerinde, yaklaşık yüz mülk ilanıyla. Sistemin değil
tek bir ekranın ölçümü: uygulamada ölçmeye değecek kadar yavaş olan başka bir
şey yoktu.

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
