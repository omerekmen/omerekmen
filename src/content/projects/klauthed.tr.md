---
title: Klauthed
slug: klauthed
track: in-progress
role: Tek geliştirici
period: 2025 — devam ediyor
summary: Rust ile geliştirilen çok kiracılı bir kimlik platformu — OAuth/OIDC, sosyal giriş, MFA ve özel alan adları; CockroachDB, Redis ve NATS üzerinde servisler hâlinde.
stack:
  - Rust
  - Actix-web
  - SvelteKit
  - CockroachDB
  - Redis
  - NATS
  - ClickHouse
  - Kubernetes
  - Terraform
domains:
  - backend
  - distributed-systems
metrics: []
links:
  github: null
  demo: null
featured: true
confidential: false
order: 70
progress: Geliştiriliyor — henüz yayınlanmadı
---

## Problem

Kimlik doğrulama, her ürünün ihtiyaç duyduğu ama kimsenin geliştirmek istemediği
parçadır. Hazır çözümler iyi ama fikirlidir; kiracı bazında özel alan adına ya da
belirli bir uyumluluk duruşuna ihtiyaç duyduğunuz anda kendinizi bir başkasının
yol haritasıyla pazarlık ederken bulursunuz.

Klauthed bu probleme kendi yaklaşımım: kiracı izolasyonunun sonradan uygulanan
bir filtre değil, veri modelinin bir özelliği olduğu çok kiracılı bir kimlik
sağlayıcı.

## Mimari

Dağıtık işlemleri ve dayanıklılık özellikleri için CockroachDB üzerinde Actix-web
ile yazılmış Rust servisleri; oturum ve token durumu için Redis; servisler arası
olaylar için NATS. Çok yazılan ve az okunan denetim ve analitik tarafını
ClickHouse üstleniyor. Önünde bir SvelteKit konsolu var.

Devam eden kapsam: OAuth/OIDC akışları, sosyal giriş, MFA ve kiracı bazında özel
alan adları.

## Kararlar

**Kiracı izolasyonu bir filtre olarak değil, veri modelinde.** Yaygın yaklaşım
tek şema ve her sorgunun eklemeyi hatırladığı bir kiracı sütunudur. Bir sorgu
unutana kadar işe yarar; hata biçimi ise bir kiracının başka bir kiracının
kimliklerini okumasıdır — bir kimlik sağlayıcısının yapabileceği en kötü hata.
İzolasyonu yapısal kılmak, o hatayı yapılabilir olmaktan çıkarır.

**PostgreSQL yerine CockroachDB.** Postgres sıkıcı ve doğru varsayılan olurdu;
çoğu projede ona uzanırdım. Kimlik, hayatta kalabilirliğin ve dağıtık
işlemlerin bir ekstra değil ürünün kendisi olduğu durum: bir bölge çöktüğü için
başarısız olan bir giriş, o bölgedeki her kiracı için kesinti demektir.

**Denetim için işlem veritabanı değil, ClickHouse.** Denetim kaydı ekleme
ağırlıklı, nadiren okunur ve sınırsız büyür. Hızlı kalması gereken kimliklerin
yanına koymak iki iş yükünü yarıştırır ve denetim hep kazanır, çünkü sayıca
fazladır.

**Hızı bilerek feda ederek Rust.** CRUD biçimli bir kimlik servisi neredeyse her
şeyde daha hızlı ilerlerdi. CRUD biçimli olmayan kısımlar — token işleme, oturum
durumu, denetim yolu — bellek güvenliği garantisinin ve kapsamlı bir tip
sisteminin estetik bir tercih olmaktan çıktığı yerler.

## Durum

**Bu proje tamamlanmadı ve aktif olarak geliştiriliyor.** Burada yer almasının
sebebi kullanıma hazır olması değil, üzerinde çalıştığım teknik olarak en zorlu
iş olması. Henüz herkese açık bir depo ya da yayınlanmış bir sürüm yok.

## Şimdiye kadar öğrendiklerim

Çok kiracılılığı anlatmak kolay, dürüst tutmak zordur. Her sorgu, her önbellek
anahtarı, her olay yükü kiracı sınırını taşımak zorunda; bir tek yol bunu
unuttuğu anda izolasyon garantisi her yerde ortadan kalkar. Bunu gelenek yerine
tiplere taşımak, aldığım en yüksek getirili karar oldu.
