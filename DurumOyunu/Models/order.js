/**
 * Order sınıfı - Müşteri siparişlerini temsil eder
 * SOLID prensiplerinden Single Responsibility Principle'a uygun olarak
 * sadece sipariş verilerini yönetir.
 */
class Order {
    /**
     * Sipariş oluşturucu
     * @param {string} id - Sipariş benzersiz kimliği
     * @param {Array<string>} requiredIngredients - Gerekli malzeme ID'leri
     * @param {string} customerComment - Müşteri yorumu
     */
    constructor(id, requiredIngredients, customerComment = '') {
        this.id = id;
        this.requiredIngredients = requiredIngredients;
        this.customerComment = customerComment;
        this.startTime = null;
        this.difficulty = this._calculateDifficulty();
    }

    /**
     * Siparişin zorluk seviyesini hesaplar
     * @returns {string} Zorluk seviyesi (easy, medium, hard)
     * @private
     */
    _calculateDifficulty() {
        const count = this.requiredIngredients.length;
        if (count <= 3) return 'easy';
        if (count <= 5) return 'medium';
        return 'hard';
    }

    /**
     * Siparişi başlatır
     */
    start() {
        this.startTime = Date.now();
    }

    /**
     * Siparişin tamamlanma durumunu kontrol eder
     * @param {Array<string>} providedIngredients - Sağlanan malzeme ID'leri
     * @returns {boolean} Sipariş tamamlandı mı?
     */
    isComplete(providedIngredients) {
        // Tüm gerekli malzemelerin sağlanıp sağlanmadığını kontrol et
        return this.requiredIngredients.every(ingredient => 
            providedIngredients.includes(ingredient)
        );
    }

    /**
     * Siparişin doğruluğunu kontrol eder ve puanı hesaplar
     * @param {Array<string>} providedIngredients - Sağlanan malzeme ID'leri
     * @returns {Object} Sonuç ve puan bilgisi
     */
    evaluate(providedIngredients) {
        if (!this.startTime) {
            return { success: false, points: 0, message: "Sipariş başlatılmadı" };
        }

        const isComplete = this.isComplete(providedIngredients);
        
        // Fazladan malzeme var mı kontrol et
        const extraIngredients = providedIngredients.filter(
            ingredient => !this.requiredIngredients.includes(ingredient)
        );
        
        // Eksik malzeme var mı kontrol et
        const missingIngredients = this.requiredIngredients.filter(
            ingredient => !providedIngredients.includes(ingredient)
        );

        // Puan hesaplama
        let points = 0;
        let message = "";
        
        // Zorluk seviyesine göre temel puan belirle
        const basePoints = {
            'easy': 50,
            'medium': 100,
            'hard': 150
        }[this.difficulty] || 100;
        
        if (isComplete && extraIngredients.length === 0) {
            // Mükemmel sipariş - tam puan
            points = basePoints;
            message = "Mükemmel! Tam istediğim gibi olmuş.";
        } else if (isComplete) {
            // Fazladan malzeme var ama tamamlanmış
            points = Math.floor(basePoints * 0.7); // %70 puan
            message = "Güzel olmuş ama fazladan malzeme koymuşsun.";
        } else if (missingIngredients.length <= 1 && extraIngredients.length <= 1) {
            // Neredeyse doğru
            points = Math.floor(basePoints * 0.5); // %50 puan
            message = "Fena değil, ama tam istediğim gibi olmamış.";
        } else {
            // Çok yanlış
            points = Math.floor(basePoints * 0.2); // %20 puan
            message = "Bu istediğim dürüme hiç benzemiyor!";
        }
        
        // Zorluk seviyesine göre bonus puan
        const difficultyBonus = {
            'easy': 0,
            'medium': 20,
            'hard': 50
        }[this.difficulty] || 0;
        
        points += difficultyBonus;
        
        return {
            success: isComplete && extraIngredients.length === 0,
            points: Math.max(0, points), // Negatif puan olmaması için
            message,
            extraIngredients,
            missingIngredients,
            difficulty: this.difficulty
        };
    }
    
    /**
     * Sipariş bilgilerini döndürür
     * @returns {Object} Sipariş bilgileri
     */
    getInfo() {
        return {
            id: this.id,
            requiredIngredients: [...this.requiredIngredients],
            customerComment: this.customerComment,
            difficulty: this.difficulty
        };
    }
} 