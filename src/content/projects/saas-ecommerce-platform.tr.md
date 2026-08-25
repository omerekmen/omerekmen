---
title: SaaS E-Ticaret Platformu
slug: saas-ecommerce-platform
track: production
role: Backend mühendisi — 4 kişilik ekip
period: Ara 2023 — Şub 2025
summary: Kimlik doğrulama, ürün, sipariş ve müşteri süreçleriyle raporlama uçlarını kapsayan; sistem tasarımından bulut dağıtımına kadar götürülüp sonrasında kendisi işleten bir müşteriye devredilen Django backend ve yönetim platformu.
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

Ödeme yapan bir müşterinin, kendisinin işletebileceği bir ticaret platformuna
ihtiyacı vardı — katalog, siparişler, müşteriler ve üçünü birden anlamayı
sağlayan raporlama.

Bariz alternatif barındırılmış bir mağaza yazılımıydı. Kurması daha hızlı, ilk
yıl daha ucuz ve ürün kataloğunu, sipariş geçmişini ve fiyatlandırma kurallarını
başkasının şemasının içine koyuyor; oraya da yalnızca o şemanın API'sinin açmayı
tercih ettiği kadarıyla ulaşabiliyorsunuz. Operasyonun kendisi ürün olan bir
müşteri için bu yanlış bir takas — barındırılan platformlar kötü olduğu için
değil, en çok değiştirmeleri gereken şey üzerinde en az kontrole sahip
olacakları şey olduğu için.

## Kısıtlar

Dört mühendis ve on dört ay; üstelik sistemi sonrasında bizsiz işletecek bir
müşteri için. Bu son madde teknoloji seçiminden daha çok kararı şekillendirdi:
kurulan her şeyin, kodu hiç okumayacak insanlar tarafından işletilebilir olması
gerekiyordu.

## Zor olan neydi

Ticaret alanları yazıya dökene kadar basit görünür. Bir sipariş tek bir şey
değildir. Sepettir, stok üzerinde bir taleptir, bir ödeme niyetidir, bir
karşılama kaydıdır ve bir rapordaki satırdır — ve bunların her biri farklı bir
anda, farklı bir sebeple, işin farklı bir parçasının talebiyle değişir. Birlikte
geldikleri için tek tabloda modellerseniz, sonraki her gereksinim canlı veri
üzerinde bir migration'a dönüşür.

## Kararlar

**Barındırılmış mağaza değil, kendi sunucumuzdaki Django.** Yukarıda anlatıldı.
Bedeli gerçek ve bilerek kabul edildi: dağıtımın, güncellemelerin ve barındırılan
bir platformun bizim adımıza üstleneceği güvenlik duruşunun sahibi biz olduk.

**Hem API'nin hem yönetim panelinin arkasında tek alan modeli.** Dahili yönetim
ekranları ve genel REST uçları aynı ürünleri, siparişleri ve müşterileri
tarif ediyor. İki ayrı model her iki tarafın bağımsız hareket etmesine izin
verirdi; bu esneklik gibi durur, ta ki bir sipariş ikisi için biraz farklı şey
ifade edene ve hangisinin doğru olduğunu kimse söyleyemeyene kadar.

**Kimlik doğrulama, ürün, sipariş ve müşterinin en baştan ayrı sorumluluklar
olması.** Dört kişilik bir ekibin ilk gün ihtiyaç duyduğundan fazla yapı — ve on
dördüncü ayın, her şeyi içine çekmiş tek bir modülü sökmekle geçmemesinin
sebebi.

## Ne inşa ettim

Dört mühendisten biri olarak backend mimarisi ve uygulaması: alan modeli ve
PostgreSQL şeması, REST uçları, aynı model üzerindeki yönetim platformu,
raporlama uçları ve CI/CD ile AWS'e dağıtım — sistem tasarımından üretime kadar.

## Etki

Platform üretime çıktı ve müşteri o günden beri, onu kuran ekip olmadan
işletiyor. Raporlama uçları işlerini günden güne yürüttükleri yer; önemli olan
sonuç da buydu: sistemin devir günü çalışması değil, devirden sonra çalışmaya
devam etmesi.

## Neyi değiştirirdim

Raporlama uçları doğrudan işlem tablolarından okuyor. Bu ölçekte doğru karar bu
— ayrı bir raporlama modeli gerçek bir iş ve sorguları zorlayacak kadar geçmiş
birikene dek hiçbir şey kazandırmıyor. Aynı zamanda ilk zorlanan yer de orası;
ve o güne gelindiğinde, o zamana dek yazılmış her rapor aynı tablolar hakkında
baştan kurulmuş bir varsayımlar kümesi oluyor. Bu çizginin nerede olduğunu keşfetmek
yerine bilmek, farklı yapacağım kısım.
