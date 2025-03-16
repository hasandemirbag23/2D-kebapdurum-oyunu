# Dürüm Efsanesi

Bu proje, "İyi Pizza, Güzel Pizza" oyununun dürüm versiyonudur. Oyunda müşteri siparişlerine göre dürüm hazırlayarak puan kazanırsınız.

## Özellikler

- MVVM (Model-View-ViewModel) mimarisi kullanılmıştır
- Farklı malzemelerle dürüm hazırlama
- Zamana karşı yarış
- Puan sistemi
- Zorluk seviyeleri

## Proje Yapısı

Proje, MVVM mimarisine uygun olarak aşağıdaki klasörlerden oluşmaktadır:

- **Models**: Veri modellerini içerir (Ingredient, Order, Game)
- **Views**: Kullanıcı arayüzünü yöneten sınıfları içerir (GameView)
- **ViewModels**: Model ve View arasında köprü görevi gören sınıfları içerir (GameViewModel)
- **Services**: İş mantığı servislerini içerir (OrderService)
- **Assets**: Stil dosyaları ve görselleri içerir

## Nasıl Oynanır

1. Tarayıcınızda `index.html` dosyasını açın
2. Ekranda görünen sipariş bilgisini okuyun
3. Sağ taraftaki malzeme butonlarına tıklayarak dürüme malzeme ekleyin
4. Yanlış malzeme eklediyseniz, malzemeye tıklayarak çıkarabilirsiniz
5. Siparişi tamamlamak için "Siparişi Tamamla" butonuna tıklayın
6. Doğru malzemeleri kullanarak ve zamanında tamamlayarak puan kazanın
7. 5 sipariş sonunda oyun biter ve toplam puanınız gösterilir

## Teknik Detaylar

- Proje tamamen JavaScript, HTML ve CSS kullanılarak geliştirilmiştir
- SOLID prensiplerine uygun olarak tasarlanmıştır
- Her sınıf tek bir sorumluluğa sahiptir (Single Responsibility Principle)
- Kod okunabilirliği için JSDoc standartlarında yorum satırları eklenmiştir

## Geliştirme

Projeyi geliştirmek için:

1. Repo'yu klonlayın
2. İstediğiniz değişiklikleri yapın
3. Tarayıcıda `index.html` dosyasını açarak test edin

## Gelecek Özellikler

- Malzeme görselleri
- Ses efektleri
- Daha fazla malzeme çeşidi
- Kaydetme ve yükleme özellikleri
- Çoklu oyuncu modu

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 