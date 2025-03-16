/**
 * GameViewModel sınıfı - Model ve View arasında köprü görevi görür
 * SOLID prensiplerinden Single Responsibility Principle'a uygun olarak
 * sadece model ve görünüm arasındaki veri akışını yönetir.
 */
class GameViewModel {
    /**
     * GameViewModel oluşturucu
     * @param {Game} gameModel - Oyun modeli
     * @param {OrderService} orderService - Sipariş servisi
     * @param {Object} sounds - Ses efektleri
     */
    constructor(gameModel, orderService, sounds = {}) {
        this.gameModel = gameModel;
        this.orderService = orderService;
        this.sounds = sounds;
        
        // Görünüm güncellemesi için callback fonksiyonları
        this.callbacks = {
            onGameStateChanged: null,
            onOrderStarted: null,
            onOrderCompleted: null,
            onIngredientAdded: null,
            onIngredientRemoved: null,
            onGameOver: null,
            onTimerUpdate: null,
            onTimeUp: null
        };
        
        // Zamanlayıcı callback'lerini ayarla
        this.gameModel.setTimerUpdateCallback((timeLeft) => {
            if (this.callbacks.onTimerUpdate) {
                this.callbacks.onTimerUpdate(timeLeft);
            }
        });
        
        this.gameModel.setTimeUpCallback(() => {
            if (this.callbacks.onTimeUp) {
                this.callbacks.onTimeUp();
                this.completeOrder(); // Süre bittiğinde siparişi otomatik tamamla
            }
        });
    }

    /**
     * Callback fonksiyonunu kaydeder
     * @param {string} eventName - Olay adı
     * @param {Function} callback - Callback fonksiyonu
     */
    on(eventName, callback) {
        if (this.callbacks.hasOwnProperty(eventName)) {
            this.callbacks[eventName] = callback;
        }
    }

    /**
     * Oyunu başlatır
     * @param {Array<Ingredient>} ingredients - Kullanılabilir malzemeler
     */
    initGame(ingredients) {
        // Oyun modelini sıfırla
        this.gameModel.reset();
        
        // Malzemeleri ekle
        this.gameModel.addIngredients(ingredients);
        
        // İlk siparişi başlat
        this.startNextOrder();
        
        // Oyun durumunu bildir
        this._notifyGameStateChanged();
    }

    /**
     * Sonraki siparişi başlatır
     * @param {string} difficulty - Zorluk seviyesi (easy, medium, hard)
     */
    startNextOrder(difficulty = 'medium') {
        // Oyun bittiyse yeni sipariş başlatma
        if (this.gameModel.isGameOver) {
            return;
        }
        
        // Zorluk seviyesini oyun seviyesine göre ayarla
        const level = this.gameModel.level;
        if (level <= 2) {
            difficulty = 'easy';
        } else if (level <= 4) {
            difficulty = 'medium';
        } else {
            difficulty = 'hard';
        }
        
        // Yeni sipariş oluştur
        const order = this.orderService.createOrder(difficulty);
        
        // Siparişi başlat
        this.gameModel.startOrder(order);
        
        // Sipariş başladı bildirimini yap
        if (this.callbacks.onOrderStarted) {
            this.callbacks.onOrderStarted(order);
        }
        
        // Oyun durumunu bildir
        this._notifyGameStateChanged();
    }

    /**
     * Siparişe malzeme ekler
     * @param {string} ingredientId - Eklenecek malzeme ID'si
     * @returns {boolean} Ekleme başarılı mı?
     */
    addIngredient(ingredientId) {
        const result = this.gameModel.addIngredientToOrder(ingredientId);
        
        if (result) {
            // Ses efekti çal
            if (this.sounds.addIngredient) {
                this.sounds.addIngredient.currentTime = 0;
                this.sounds.addIngredient.play().catch(e => console.log('Ses çalınamadı:', e));
            }
            
            // Malzeme eklendi bildirimini yap
            if (this.callbacks.onIngredientAdded) {
                const ingredient = this.orderService.getIngredientById(ingredientId);
                this.callbacks.onIngredientAdded(ingredient);
            }
            
            // Oyun durumunu bildir
            this._notifyGameStateChanged();
        }
        
        return result;
    }

    /**
     * Siparişten malzeme çıkarır
     * @param {string} ingredientId - Çıkarılacak malzeme ID'si
     * @returns {boolean} Çıkarma başarılı mı?
     */
    removeIngredient(ingredientId) {
        const result = this.gameModel.removeIngredientFromOrder(ingredientId);
        
        if (result) {
            // Ses efekti çal
            if (this.sounds.removeIngredient) {
                this.sounds.removeIngredient.currentTime = 0;
                this.sounds.removeIngredient.play().catch(e => console.log('Ses çalınamadı:', e));
            }
            
            // Malzeme çıkarıldı bildirimini yap
            if (this.callbacks.onIngredientRemoved) {
                this.callbacks.onIngredientRemoved(ingredientId);
            }
            
            // Oyun durumunu bildir
            this._notifyGameStateChanged();
        }
        
        return result;
    }

    /**
     * Siparişi tamamlar
     * @returns {Object} Değerlendirme sonucu
     */
    completeOrder() {
        const result = this.gameModel.completeOrder();
        
        // Ses efekti çal
        if (this.sounds) {
            if (result.success) {
                if (this.sounds.orderSuccess) {
                    this.sounds.orderSuccess.currentTime = 0;
                    this.sounds.orderSuccess.play().catch(e => console.log('Ses çalınamadı:', e));
                }
            } else {
                if (this.sounds.orderFail) {
                    this.sounds.orderFail.currentTime = 0;
                    this.sounds.orderFail.play().catch(e => console.log('Ses çalınamadı:', e));
                }
            }
        }
        
        // Sipariş tamamlandı bildirimini yap
        if (this.callbacks.onOrderCompleted) {
            this.callbacks.onOrderCompleted(result);
        }
        
        // Oyun bittiyse oyun bitti bildirimini yap
        if (result.isGameOver) {
            if (this.sounds && this.sounds.gameOver) {
                this.sounds.gameOver.currentTime = 0;
                this.sounds.gameOver.play().catch(e => console.log('Ses çalınamadı:', e));
            }
            
            if (this.callbacks.onGameOver) {
                this.callbacks.onGameOver(result);
            }
        } else {
            // Oyun bitmediyse sonraki siparişi başlat
            setTimeout(() => {
                this.startNextOrder();
            }, 2000);
        }
        
        // Oyun durumunu bildir
        this._notifyGameStateChanged();
        
        return result;
    }

    /**
     * Oyunu yeniden başlatır
     */
    restartGame() {
        // Oyun modelini sıfırla
        this.gameModel.reset();
        
        // İlk siparişi başlat
        this.startNextOrder();
        
        // Oyun durumunu bildir
        this._notifyGameStateChanged();
    }

    /**
     * Kullanılabilir malzemeleri döndürür
     * @returns {Array<Ingredient>} Kullanılabilir malzemeler
     */
    getAvailableIngredients() {
        return this.gameModel.availableIngredients;
    }

    /**
     * Oyun durumunu döndürür
     * @returns {Object} Oyun durumu
     */
    getGameState() {
        return this.gameModel.getState();
    }

    /**
     * Oyun durumu değiştiğinde bildirim yapar
     * @private
     */
    _notifyGameStateChanged() {
        if (this.callbacks.onGameStateChanged) {
            this.callbacks.onGameStateChanged(this.getGameState());
        }
    }
} 