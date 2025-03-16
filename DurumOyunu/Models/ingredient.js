/**
 * Ingredient sınıfı - Dürüm malzemelerini temsil eder
 * SOLID prensiplerinden Single Responsibility Principle'a uygun olarak
 * sadece malzeme verilerini yönetir.
 */
class Ingredient {
    /**
     * Malzeme oluşturucu
     * @param {string} id - Malzeme benzersiz kimliği
     * @param {string} name - Malzeme adı
     * @param {string} image - Malzeme görseli (isteğe bağlı)
     * @param {number} points - Malzeme puan değeri
     */
    constructor(id, name, image = null, points = 10) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.points = points;
        this.position = { x: 0, y: 0 }; // Malzemenin dürüm üzerindeki konumu
        this.rotation = 0; // Malzemenin dürüm üzerindeki rotasyonu
        this.scale = 1; // Malzemenin dürüm üzerindeki ölçeği
    }

    /**
     * Malzeme bilgilerini döndürür
     * @returns {Object} Malzeme bilgileri
     */
    getInfo() {
        return {
            id: this.id,
            name: this.name,
            image: this.image,
            points: this.points,
            position: this.position,
            rotation: this.rotation,
            scale: this.scale
        };
    }
    
    /**
     * Malzeme konumunu ayarlar
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
     */
    setPosition(x, y) {
        this.position = { x, y };
    }
    
    /**
     * Malzeme rotasyonunu ayarlar
     * @param {number} angle - Derece cinsinden açı
     */
    setRotation(angle) {
        this.rotation = angle;
    }
    
    /**
     * Malzeme ölçeğini ayarlar
     * @param {number} scale - Ölçek değeri
     */
    setScale(scale) {
        this.scale = scale;
    }
} 