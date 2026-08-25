---
title: TELCO CRM Platformu
slug: telco-crm-platform
track: production
role: Backend mühendisi — bitirme projesi ekibi, Turkcell GYGY 5.0
period: Mar 2026 — Tem 2026
summary: Spring Cloud mikroservisleri üzerine kurulu, abone yaşam döngüsünü KYC ve katalogdan sipariş, faturalama ve destek taleplerine kadar kapsayan bir telekomünikasyon CRM'i.
stack:
  - Java 21
  - Spring Boot
  - Spring Cloud
  - Spring Data JPA
  - Spring Security
  - PostgreSQL
  - Kafka
  - Redis
  - Docker
  - Kubernetes
  - OpenTelemetry
domains:
  - backend
  - distributed-systems
metrics:
  - { label: Sınırlı bağlam, value: '9' }
  - { label: Veritabanı, value: '9' }
links:
  github: null
  demo: null
featured: true
confidential: false
order: 100
---

## Problem

Bir telekom operatörünün CRM'i, abonenin tüm yaşam döngüsünü tek ve tutarlı bir
görünümde tutmak zorundadır — kimlik ve KYC, satın aldığı katalog, siparişleri,
aktif abonelikleri, ölçümlenen kullanımı, faturaları, ödemeleri, bildirimleri ve
destek talepleri. Bu alanlar birbirinden çok farklı hızlarda ve çok farklı yükler
altında değişir. Hepsini tek bir uygulama olarak modellemek, her dağıtımı tüm
sistemi riske atan bir işleme dönüştürür.

## Kısıtlar

Sabit bir program takvimi üzerinde çalışan, sonrasında kimsenin işletmeyeceği
bir sistem kuran bir bitirme ekibi. Bu iki yönlü keser: hakkında yanılınacak
üretim trafiği yok, ama tasarımı düzeltecek operasyonel geri bildirim de yok.
Aşağıdaki her şey, bir çağrı cihazından değil ilk ilkelerden kurulması gereken
bir savunma.

## Zor olan neydi

Abone yaşam döngüsü müşteriye tek bir hikâye, mühendise dokuz farklı değişim
hızıdır. Katalog pazarlama öyle dediğinde değişir; kullanım sürekli değişir; bir
fatura ayda bir kez değişir ve sonra bir daha asla değişmemelidir. Bunların
hepsini tek uygulamada tutmak, her dağıtımın dokuzunun birden riskini taşıması
demektir — ve en sık değişen parçalar, hiç değişmemesi gereken parçaları
tutuyordur.

## Kararlar

**Ayrı servislerin arkasında paylaşılan şema değil, servis başına veritabanı.**
Ucuz seçenek — tek veritabanı, dokuz dağıtılabilir — size izolasyon olmadan
dağıtım hikâyesini verir; ilk bağlamlar arası join de onu sessizce fazladan ağ
çağrıları olan bir monolite geri çevirir. Bedeli aşağıda dürüstçe ödeniyor.

**Senkron çağrılar değil, bağlamlar arası tek durum olarak Kafka alan olayları.**
Faturalama, Sipariş'ten siparişi isteyebilirdi. O zaman Sipariş çöktüğünde
Faturalama da çöker ve bu bağımlılık başarısız olana kadar görünmez. Olaylar
bunu tersine çevirir: Sipariş ne olduğunu bildirir ve kimin dinlediğini
umursamayı bırakır.

**Redis yalnızca okumanın baskın, değişimin seyrek olduğu yerde.** Katalog ve
uygunluk sorguları buna uyar; siparişler ve kullanım uymaz. Sürekli değişen
verinin önündeki bir önbellek gecikme satın alıp doğruluk satar, ki bir
faturalama sistemi için yanlış yön budur.

**Üç değil, dokuz bağlam.** Daha az ve daha büyük servisler daha az iş olurdu ve
kullanımı, faturalamayı ve abonelikleri — gerçekten farklı üç değişim hızını —
tek dağıtıma geri koyardı.

## Mimari

Platform, sınırlı bağlam (bounded context) sınırları boyunca dokuz servise
ayrıldı; her biri kendi PostgreSQL veritabanına sahip. Hiçbir servis bir
diğerinin tablolarına doğrudan erişmiyor; durum, servisler arasında Kafka alan
olayları olarak taşınıyor.

- **API Gateway** — tek giriş noktası, yönlendirme, JWT/OAuth2 doğrulaması
- **Müşteri / KYC** — kimlik, doğrulama durumu, onaylar
- **Katalog** — ürünler, tarifeler, uygunluk kuralları
- **Sipariş** — sipariş alma ve orkestrasyon
- **Abonelik** — abone bazında yaşam döngüsü durumu
- **Kullanım** — ölçümlenen tüketim
- **Faturalama ve Ödeme** — fatura kesimi ve mutabakat
- **Bildirim** — giden mesajlaşma
- **Talep Yönetimi** — destek kayıtları

Redis, sık okunan ve nadiren değişen katalog ve uygunluk sorguları için
read-through önbellekleme sağlıyor. Gözlemlenebilirlik tarafında Prometheus ve
Grafana ile birlikte servisler arası OpenTelemetry izleme kullanılıyor; böylece
tek bir sipariş uçtan uca takip edilebiliyor.

## Ne geliştirdim

Backend servisleri ve aralarındaki olay sözleşmeleri; ayrıca ekibin dağıtım için
kullandığı konteynerleştirme ve Kubernetes manifestoları.

## Etki

Kubernetes üzerinde çalışan dokuz servis ve OpenTelemetry ile servis sınırları
boyunca uçtan uca izlenebilen tek bir sipariş — henüz kullanıcısı olmayan bir
sistem için önemli olan sonuç bu, çünkü dağıtık izleme "sipariş bir yerde
başarısız oldu"yu belirli bir servise ve belirli bir aralığa çeviren şeydir.

Bu sayfadaki iki sayı ölçüm değil sayım: dokuz sınırlı bağlam, dokuz veritabanı,
kuruluş gereği servis başına bir tane.

## Bağlam

Turkcell GYGY 5.0 Java Geliştirme Programı'nın bitirme projesi olarak
geliştirildi. Yaklaşık 5.000 başvuru arasından seçilen 35 kişiden biri olarak
katıldığım 120 saatlik bir programdı.

## Geriye dönüp baktığımda

Servis başına ayrı veritabanı, izolasyon açısından doğru karardı; ancak bağlamlar
arası her okumayı ya bir olay izdüşümüne ya da senkron bir çağrıya zorladı.
İkinci bir denemede, bir sorgunun üç servisten veri istediği ortaya çıktığında
tepkisel olarak eklemek yerine, olay akışından beslenen okuma modellerine baştan
daha fazla emek ayırırdım.
