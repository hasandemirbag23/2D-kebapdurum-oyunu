/**
 * Game sınıfı - Oyun durumunu ve mantığını temsil eder
 * SOLID prensiplerinden Single Responsibility Principle'a uygun olarak
 * sadece oyun durumunu yönetir.
 */
class Game {
    /**
     * Oyun oluşturucu
     * @param {number} maxRounds - Maksimum tur sayısı
     */
    constructor(maxRounds = 10) {
        this.score = 0;
        this.currentRound = 0;
        this.maxRounds = maxRounds;
        this.isGameOver = false;
        this.currentOrder = null;
        this.selectedIngredients = [];
        this.level = 1;
        this.timeLeft = 60; // Başlangıç süresi (saniye)
        this.timerInterval = null;
        this.onTimerUpdate = null; // Zamanlayıcı güncellendiğinde çağrılacak fonksiyon
        this.onTimeUp = null; // Süre bittiğinde çağrılacak fonksiyon
        
        // Oyun için kullanılabilir tüm malzemeler
        this.availableIngredients = [];
    }

    /**
     * Oyuna yeni bir malzeme ekler
     * @param {Ingredient} ingredient - Eklenecek malzeme
     */
    addIngredient(ingredient) {
        this.availableIngredients.push(ingredient);
    }

    /**
     * Oyuna birden fazla malzeme ekler
     * @param {Array<Ingredient>} ingredients - Eklenecek malzemeler
     */
    addIngredients(ingredients) {
        this.availableIngredients = [...this.availableIngredients, ...ingredients];
    }

    /**
     * Mevcut siparişe malzeme ekler
     * @param {string} ingredientId - Eklenecek malzeme ID'si
     * @returns {boolean} Ekleme başarılı mı?
     */
    addIngredientToOrder(ingredientId) {
        if (this.isGameOver || !this.currentOrder) {
            return false;
        }
        
        // Malzeme zaten eklenmişse tekrar ekleme
        if (this.selectedIngredients.includes(ingredientId)) {
            return false;
        }
        
        this.selectedIngredients.push(ingredientId);
        return true;
    }

    /**
     * Mevcut siparişten malzeme çıkarır
     * @param {string} ingredientId - Çıkarılacak malzeme ID'si
     * @returns {boolean} Çıkarma başarılı mı?
     */
    removeIngredientFromOrder(ingredientId) {
        if (this.isGameOver || !this.currentOrder) {
            return false;
        }
        
        const index = this.selectedIngredients.indexOf(ingredientId);
        if (index === -1) {
            return false;
        }
        
        this.selectedIngredients.splice(index, 1);
        return true;
    }

    /**
     * Yeni bir sipariş başlatır
     * @param {Order} order - Başlatılacak sipariş
     */
    startOrder(order) {
        this.currentOrder = order;
        this.selectedIngredients = [];
        this.currentOrder.start();
        
        // Zamanlayıcıyı başlat
        this.startTimer();
    }
    
    /**
     * Zamanlayıcıyı başlatır
     */
    startTimer() {
        // Önceki zamanlayıcıyı temizle
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Seviyeye göre süreyi ayarla
        this.timeLeft = Math.max(60 - (this.level - 1) * 5, 30);
        
        // Zamanlayıcıyı başlat
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            
            // Zamanlayıcı güncellendiğinde callback'i çağır
            if (this.onTimerUpdate) {
                this.onTimerUpdate(this.timeLeft);
            }
            
            // Süre bitti mi kontrol et
            if (this.timeLeft <= 0) {
                this.stopTimer();
                
                // Süre bittiğinde callback'i çağır
                if (this.onTimeUp) {
                    this.onTimeUp();
                }
            }
        }, 1000);
    }
    
    /**
     * Zamanlayıcıyı durdurur
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Mevcut siparişi tamamlar ve sonucu değerlendirir
     * @returns {Object} Değerlendirme sonucu
     */
    completeOrder() {
        if (!this.currentOrder || this.isGameOver) {
            return { success: false, points: 0, message: "Aktif sipariş yok" };
        }
        
        // Zamanlayıcıyı durdur
        this.stopTimer();
        
        // Kalan süreye göre bonus puan hesapla
        const timeBonus = Math.floor(this.timeLeft * 0.5);
        
        const result = this.currentOrder.evaluate(this.selectedIngredients);
        
        // Zaman bonusunu ekle
        if (result.success) {
            result.timeBonus = timeBonus;
            result.points += timeBonus;
        } else {
            result.timeBonus = 0;
        }
        
        this.score += result.points;
        this.currentRound++;
        
        // Seviye kontrolü
        if (this.currentRound % 3 === 0 && this.level < 5) {
            this.level++;
        }
        
        // Oyun bitti mi kontrol et
        if (this.currentRound >= this.maxRounds) {
            this.isGameOver = true;
        }
        
        this.currentOrder = null;
        this.selectedIngredients = [];
        
        return {
            ...result,
            totalScore: this.score,
            currentRound: this.currentRound,
            isGameOver: this.isGameOver,
            level: this.level
        };
    }

    /**
     * Oyunu sıfırlar
     */
    reset() {
        this.score = 0;
        this.currentRound = 0;
        this.isGameOver = false;
        this.currentOrder = null;
        this.selectedIngredients = [];
        this.level = 1;
        this.stopTimer();
        this.timeLeft = 60;
    }

    /**
     * Oyun durumunu döndürür
     * @returns {Object} Oyun durumu
     */
    getState() {
        return {
            score: this.score,
            currentRound: this.currentRound,
            maxRounds: this.maxRounds,
            isGameOver: this.isGameOver,
            hasActiveOrder: !!this.currentOrder,
            selectedIngredients: [...this.selectedIngredients],
            level: this.level,
            timeLeft: this.timeLeft
        };
    }
    
    /**
     * Zamanlayıcı güncellendiğinde çağrılacak fonksiyonu ayarlar
     * @param {Function} callback - Çağrılacak fonksiyon
     */
    setTimerUpdateCallback(callback) {
        this.onTimerUpdate = callback;
    }
    
    /**
     * Süre bittiğinde çağrılacak fonksiyonu ayarlar
     * @param {Function} callback - Çağrılacak fonksiyon
     */
    setTimeUpCallback(callback) {
        this.onTimeUp = callback;
    }
} 