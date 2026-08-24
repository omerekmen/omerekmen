---
title: ERP Muhasebe ve Satın Alma Modernizasyonu
slug: erp-modernisation
track: production
role: Yazılım mühendisi — çalışan öğrenci, 3–4 kişilik ERP ekibi (iki ay boyunca tek mühendis)
period: Haz 2024 — May 2026
summary: Bir Koç Topluluğu ERP'sinin muhasebe ve satın alma modülleri, üretimde çalışmaya devam ederken .NET Framework'ten .NET 8/9 mikroservislerine taşındı — ve aralarındaki manuel adımlar otomasyona devredildi.
stack:
  - .NET 8
  - ASP.NET Core
  - Entity Framework Core
  - MediatR/CQRS
  - SQL Server
  - T-SQL
  - SSIS
  - SSRS
  - RabbitMQ
  - Redis
  - Docker
  - Kubernetes
  - Azure DevOps
domains:
  - backend
  - data-engineering
metrics:
  - { label: Masraf işleme süresi, value: '-70%' }
  - { label: Muhasebe süreç süresi, value: '-30%' }
  - { label: Saklı yordam, value: '50+' }
  - { label: SSRS raporu, value: '15+' }
links:
  github: null
  demo: null
featured: true
confidential: false
order: 98
---

## Problem

Otokoç Otomotiv muhasebe ve satın alma süreçlerini, insanların gün boyu
kullandığı bir ERP üzerinden yürütüyor. Bu sistemde aynı anda iki sorun vardı ve
ikisi birbirinin tersi yönde çekiyordu.

Ekranlar, bir kuralın verebileceği kararları insanlardan bekliyordu. Bir iş
seyahatine ait masraf talebi bir sisteme yazılıyor, elle başka bir sistemle
karşılaştırılıyor ve ikisini birden okuyan biri tarafından onaylanıyordu. Bu
adımların her biri yavaşlamak ya da hata yapmak için bir fırsattı.

Altta ise platform bir .NET Framework monoliti idi. Herhangi bir şeyi
değiştirmek her şeyi riske atmak anlamına geliyordu — ki bu tam olarak bir ekibin
ekranları iyileştirmeyi bırakmasına yol açan koşuldur.

## Ne inşa ettim

Muhasebe ve satın alma modüllerini, Entity Framework Core üzerinde ASP.NET Core
Web API'leri olarak yazdım; MediatR ve CQRS ayrımıyla, yoğun bir liste ekranı
için optimize edilmiş okuma yolunun bir onay akışının arkasındaki yazma yoluyla
aynı modeli paylaşmak zorunda kalmamasını sağladım.

Otomasyon işi bunun üzerine oturdu. Personel masraf süreci — iş seyahati ve
konaklama — iki ekranı karşılaştıran bir insan yerine, Otokoç ve Setur
sistemleri arasında kural tabanlı bir entegrasyona dönüştü. Yalnızca bu akışın
işlem süresi %70'in üzerinde azaldı; muhasebe ve satın alma genelinde ise
yaklaşık %30.

## Altındaki veri

Ekranlar görünen yarısı. Diğer yarısı veriyi içeri almak ve geri çıkarmak:

- Ağdan bir sıçrama uzakta değil, verinin yanında durması gereken mantık için
  **50'den fazla T-SQL saklı yordamı**.
- ELT işini yapan **6 SSIS paketi** — kaynak sistemlerden zamanlanmış olarak
  çekip raporlama katmanının erişebileceği yere indiriyor.
- Başka türlü girişi olmayan sistemlerle **API entegrasyonları**.
- **15'ten fazla SSRS raporu**; her biri gerçekten ihtiyaç duyan çalışma birimine
  yönlendirilmiş, böylece bir satın alma yöneticisiyle bir finans yöneticisi aynı
  genel dökümü okuyup farklı sonuçlara varmıyor.

Sorgu performansı kendi başına ayrı bir iş hattıydı: yürütme planı analizi,
ekranların gerçekte nasıl sorguladığına uyan bir indeksleme stratejisi ve şeklin
kendisi sorun olduğunda şema düzeyinde yeniden tasarım.

## Durmadan taşımak

.NET Framework'ten .NET 8/9 mikroservislerine geçiş, eski sistem hizmet vermeye
devam ederken yürüdü. Framework tarafındaki destek paralelde canlı kaldı;
böylece hiçbir operasyonel gün göçün bitmiş olmasına bağlı olmadı. Servisler
arasındaki mesajlaşmayı RabbitMQ taşıdı, okuma yükünü Redis aldı ve dağıtımlar
otomatik hatlar üzerinden Docker ve Kubernetes ile çıktı.

İşler Azure DevOps'ta Scrum ritmiyle takip edildi — üretime kadar izlenen 20'den
fazla iş kalemi, çoğu hayatına teknik bir şeye çevrilmesi gereken bir iş
gereksinim dokümanı olarak başlayan.

## Ekip neye benziyordu

Üç-dört mühendisle başladı. İkisi ayrıldı ve yaklaşık iki ay boyunca modüldeki
tek kişi bendim. Teslimat devam etti; bu da o iki ayda gösterilen bir
kahramanlıktan çok, modülün ne kadarını zaten anlamış olmam gerektiğine dair bir
ifade.

## Neyi değiştirirdim

Raporlama katmanı noktadan noktaya idi: her SSRS raporu, işlem şemasına karşı
kendi sorgusuydu. Bu ilk on rapor için ucuzdur ve sonraki her rapor için giderek
pahalılaşır, çünkü her yeni rapor aynı tablolar hakkında baştan kurulmuş bir
varsayımlar kümesidir. Modellenmiş bir raporlama katmanı — uyumlulaştırılmış
boyutlar, "onaylanmış bir satın alma"nın tanımlandığı tek bir yer — rapor
sayısını, tanımlar birbirinden ayrışmadan büyütebileceğiniz bir şey haline
getirirdi. Sonrasında gelen veri platformu işine en doğrudan taşıdığım ders bu.
