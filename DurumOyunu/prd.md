# Dürüm Oyunu 3D Dönüşüm PRD

## Yapıldı (Mevcut Durum)

### Genel Yapı
- 2D dürüm hazırlama oyunu
- Malzemelerin seçimi ve dürüm üzerine yerleştirilmesi
- Sipariş sistemi ve müşteri istekleri
- Puan sistemi ve zamanlayıcı
- Oyun sonu ekranı

### Mevcut Bileşenler
- Dürüm alanı: Malzemelerin yerleştirildiği temel alan
- Malzeme paneli: Seçilebilir malzemelerin listelendiği kısım
- Sipariş paneli: Müşteri siparişlerinin gösterildiği alan
- Skor paneli: Puanın gösterildiği bölüm
- Zamanlayıcı: Oyun süresini gösteren sayaç

### Teknik Altyapı
- HTML/CSS/JavaScript tabanlı web oyunu
- Responsive tasarım (mobil uyumlu)
- CSS animasyonları ve geçişler

## Yapılacaklar (3D Dönüşüm)

### Teknik Altyapı Değişiklikleri
- Three.js kütüphanesinin entegrasyonu
- WebGL desteğinin eklenmesi
- 3D model formatlarının belirlenmesi (glTF veya OBJ)
- Fizik motoru entegrasyonu (opsiyonel)

### 3D Modellemeler
- Dürüm standı/tezgahı modellemesi
- 3D malzeme modelleri:
  - Lavaş/dürüm ekmeği
  - Et (döner, şiş, köfte vb.)
  - Sebzeler (domates, soğan, marul, biber vb.)
  - Soslar (3D partikül efektleri olarak)
- Mutfak ortamı ve arka plan modelleri
- Müşteri karakterleri (opsiyonel)

### Oynanış İyileştirmeleri
- 3D ortamda dürüm hazırlama mekanikleri
- Malzemeleri sürükle-bırak yerine gerçekçi yerleştirme
- Döner kesme animasyonu
- Dürüm sarma/paketleme mekanikleri
- Kamera açıları ve perspektif kontrolleri
- Derinlik hissi ve gerçekçi etkileşimler

### Kullanıcı Arayüzü Değişiklikleri
- 3D ortama uygun menü tasarımı
- Başlangıç ekranı (görsel referanstaki gibi)
- Düğmelerin 3D görünümü
- Tezgah üzerinde malzeme kapları
- Soslar için şişeler ve dispenserlar
- Yan paneller yerine tezgah üzerinde yerleşik UI

### Görsel İyileştirmeler
- Işıklandırma ve gölgelendirme
- Gerçekçi doku kaplamaları (texture)
- Partikül efektleri (buhar, duman vb.)
- Post-processing efektleri (bloom, ambient occlusion)
- Dinamik ışıklar ve yansımalar



### Optimizasyon
- Düşük ve yüksek kalite ayarları
- Mobil cihazlar için optimize edilmiş 3D modeller
- LOD (Level of Detail) sistemi
- Asset yükleme optimizasyonu

### İlave Özellikler
- Tutorial modu
- Zorluk seviyeleri
- Farklı restoranlar/mekanlar
- Yeni reçeteler ve malzemeler
- Özelleştirme seçenekleri

## Önceliklendirme ve Geliştirme Aşamaları

### Aşama 1: Temel 3D Dönüşüm
- Three.js entegrasyonu
- Temel 3D modellerin oluşturulması
- Basit dürüm hazırlama mekanikleri

### Aşama 2: Görsel İyileştirmeler
- Detaylı modeller ve dokular
- Işıklandırma ve gölgelendirme
- Arayüz iyileştirmeleri

### Aşama 3: Gelişmiş Mekanikler
- Gerçekçi malzeme yerleştirme
- Dürüm sarma animasyonları
- Fizik entegrasyonu

### Aşama 4: Optimizasyon ve Cilalama
- Performans iyileştirmeleri
- Hata düzeltmeleri
- Kullanıcı geri bildirimlerine göre düzenlemeler

## Teknik Gereksinimler
- Modern web tarayıcı desteği (Chrome, Firefox, Safari, Edge)
- WebGL 2.0 desteği
- Minimum 4GB RAM
- Orta düzey GPU (mobil cihazlar için optimize edilmiş sürüm)

## Tavsiye Edilen Teknolojiler
- HTML5 + CSS3
- JavaScript (ES6+)
- Three.js (3D rendering)
- GSAP (animasyonlar için)
- Howler.js (ses)
- Webpack/Vite (asset building)