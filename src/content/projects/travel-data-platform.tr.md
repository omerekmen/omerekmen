---
title: Seyahat Grubu Veri Platformu
slug: travel-data-platform
track: production
role: Veri mühendisi — SeturTech veri ekibi
period: Tem 2026 — devam ediyor
summary: Bir Koç Topluluğu seyahat şirketinin arkasındaki veri platformu — canlı sistemlerden, entegrasyonlardan, API uçlarından ve dosya bırakımlarından Fabric göl evi ve ambarına ELT; raporlama, tahminleme ve Ar-Ge tek bir yönetilen model kümesinden besleniyor.
stack:
  - Microsoft Fabric
  - Azure Data Factory
  - Azure SQL Database
  - Azure Functions
  - Power BI
  - Python
  - Parquet
  - Dynamics 365
  - SAP
domains:
  - data-engineering
  - analytics
metrics: []
links:
  github: null
  demo: null
featured: true
confidential: false
order: 99
---

## Problem

Setur, Koç Topluluğu'nun seyahat ve turizm şirketi; verisi ne tek bir yerden ne
de tek bir şekilde geliyor. Bir kısmı şu anda üzerine yazılan operasyonel
sistemlerde duruyor. Bir kısmı iş ortağı entegrasyonlarından geliyor. Bir kısmı
başkasının takvimine göre çalışan API uçlarından, bir kısmı ise yalnızca Parquet
dosyaları olarak beliriyor.

Her iş birimi bu veriden bir cevap bekliyor — C seviyesi, finans ve muhasebe,
müşteri destek ve yöneticileri — ve tarihsel olarak her biri bu cevabı birinden
bir döküm çekmesini isteyerek alıyordu. Bu, iki döküm birbirini tutmayana kadar
işe yarar; ondan sonra hangi sayının yanlış olduğunu kimse söyleyemez.

## Kısıtlar

Kaynaklar benim değiştirebileceğim şeyler değil. Şu anda üzerine yazılan bir
operasyonel sistem, başkasının sürüm takvimindeki bir iş ortağı entegrasyonu,
cevap verdiğinde cevap veren bir API — hiçbiri ambar öyle tercih ettiği için
kendini yeniden yapılandırmayacak. Aşağıdaki her tasarım kararı, platformun
değişkenliği pazarlıkla ortadan kaldırmak yerine soğurduğu gerçeğinden
başlıyor.

## Zor olan neydi

Bir kaynağı entegre etmek, onu nasıl okuyacağınızı değil ne anlama geldiğini
anlamak demek. Aynı müşteriyi tarif eden bir SAP kaydıyla bir CRM kaydının,
ikisinden biri raporlanmaya değer olmadan önce anlaşması gerekiyor — ve
anlaşamadıkları yerler, biri ikisine birden dokunan bir soru sorana kadar
görünmez kalıyor. Bayt taşımanın teknik işi küçük yarısı.

## Kararlar

**Görsel tasarımcı yerine Fabric not defterlerinde Python.** Sürükle-bırak bir
dönüşümü kurmak daha hızlı ve gözden geçirmek fiilen imkânsız — mantık kimsenin
diff alamayacağı bir diyagramda yaşıyor ve bir değişiklik iz bırakmayan bir tık.
Not defterleri dönüşüm mantığını, altı ay sonra o odada olmayan birinin
okuyabileceği, gözden geçirebileceği ve üzerine düşünebileceği dosyalara koyuyor.

**Tam yeniden yükleme değil, filigran.** Değişmemiş bir geçmişi yeniden işlemek
varsayılan tercihtir, çünkü basit ve her zaman doğrudur. Aynı zamanda başarısız
her koşunun bedelini tüm pencereye ödetir; gecelik bir yüklemenin günlük bir
olaya dönüşmesi de böyledir. Filigran başarısız bir koşunun kaldığı yerden devam
etmesini sağlar; bedeli, hattın artık durum sahibi olması ve durumun yanlış
olabilmesidir.

**Raporların göl evinden okuması yerine ortada yönetilen bir ambar.** Her
raporun kendi mantığını ham tablolar üzerinde tanımlamasına izin vermek rapor
başına daha hızlıdır ve platformun var oluş sebebi olan anlaşmazlığı birebir
üretir. Ambar, "aktif müşteri"nin bir kez tanımlandığı yerdir.

**Tahminleme ve Ar-Ge için raporlamayla aynı modeller.** Alternatif — bir
denemenin kendi dökümünü çekmesi — daha hızlıdır ve asıl sorunu, fark
edilmesinin daha zor olduğu bir yerde geri getirir. Bir denemeyle bir yönetim
kurulu raporunun geçen çeyrek konusunda anlaşamaması, ikisinden birinin biraz
geç kalmasından çok daha kötü bir sorundur.

## Platformun şekli

Beş aşama, ve değer aralarındaki sınırlarda:

1. **Kaynak sistemler** — Dynamics 365, SAP, CRM platformları, iş ortağı
   entegrasyonları, REST uçları, bırakılan dosyalar.
2. **Alım** — Azure Data Factory kopyalama ve orkestrasyon hatları; yeniden
   deneme ve filigran (watermark) mantığıyla, başarısız bir çalışma değişmemiş
   bir geçmişi yeniden işlemek yerine kaldığı yerden devam ediyor.
3. **Göl evi** — ham dosyalar Microsoft Fabric içinde tabloya dönüşüyor.
   Dönüşümler Python ile Fabric not defterlerinde çalışıyor; mantık görsel bir
   tasarımcının içine gömülmek yerine okunabilir ve gözden geçirilebilir oluyor.
4. **Ambar** — tüm şirketin okuduğu uyumlulaştırılmış modeller, böylece aynı
   soruyu soran iki rapor aynı sayıyı döndürüyor.
5. **Sunum** — raporlama için Power BI; doğrudan sorgulanması ya da tetiklenmesi
   gereken yerlerde Azure SQL Database ve Azure Functions; ve tahminleme ile
   Ar-Ge çalışmalarının altında aynı yönetilen veri kümeleri.

## Ne yapıyorum

Hatları kuruyor ve işletiyorum: her kaynaktan alım, onu modellenmiş bir şeye
çeviren dönüşümler ve kimse istemeden güncel kalmasını sağlayan zamanlama. Bir
kaynak sistemi entegre etmek, onu nasıl okuyacağınız kadar ne anlama geldiğini
de anlamak demek — aynı müşteriyi tarif eden bir SAP kaydıyla bir CRM kaydının,
ikisinden biri raporlanmaya değer olmadan önce anlaşması gerekiyor.

Yerini aldığımız şey, tekrar eden manuel döküm. Zamanlanmış bir hatta dönüşen
her döküm, artık yaşanmayacak bir anlaşmazlık kategorisi.

## Raporlama, tahminleme ve sonrasındaki iş

Raporlama görünen çıktı, ama tek tüketici değil. Tahminleme ve Ar-Ge de kendi
dökümlerinden değil aynı yönetilen modellerden okuyor; ambarı ortaya koymanın
bütün amacı da bu: bir denemeyle bir yönetim kurulu raporunun geçen çeyrek
konusunda anlaşamaması, ikisinden birinin biraz geç kalmasından çok daha kötü
bir sorundur.

## Neyi değiştirirdim

Dürüst kısıt kapsam. Yönetilen bir model, ancak işin gerçekten ondan okuyan
kısmı kadar faydalıdır ve hâlâ platformdan eski olup onun etrafından dolaşan
raporlamalar var. Bu yolları emekliye ayırmak, yenilerini kurmaktan daha yavaş
ve daha az ilgi çekici — ve kalan değerin çoğu orada.
