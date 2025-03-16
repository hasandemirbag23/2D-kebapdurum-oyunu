/**
 * GameView sınıfı - Kullanıcı arayüzünü yönetir
 * SOLID prensiplerinden Single Responsibility Principle'a uygun olarak
 * sadece kullanıcı arayüzünü yönetir.
 */
class GameView {
    /**
     * GameView oluşturucu
     * @param {GameViewModel} viewModel - Oyun ViewModel'i
     */
    constructor(viewModel) {
        this.viewModel = viewModel;
        
        // DOM elementleri
        this.elements = {
            durum: document.getElementById('durum-ingredients'),
            durumWrapper: document.getElementById('durum-wrapper'),
            ingredientsContainer: document.getElementById('ingredients-container'),
            currentOrder: document.getElementById('current-order'),
            submitOrderBtn: document.getElementById('submit-order'),
            scoreDisplay: document.getElementById('score'),
            gameOverPanel: document.getElementById('game-over'),
            finalScoreDisplay: document.getElementById('final-score'),
            restartGameBtn: document.getElementById('restart-game'),
            timerDisplay: document.getElementById('time-left'),
            levelDisplay: document.getElementById('current-level')
        };
        
        // Event listener'ları ekle
        this._setupEventListeners();
        
        // ViewModel callback'lerini ayarla
        this._setupViewModelCallbacks();
    }

    /**
     * Oyunu başlatır
     * @param {Array<Ingredient>} ingredients - Kullanılabilir malzemeler
     */
    startGame(ingredients) {
        this.viewModel.initGame(ingredients);
        this._renderIngredientButtons(ingredients);
        this._hideGameOverPanel();
    }

    /**
     * Event listener'ları ayarlar
     * @private
     */
    _setupEventListeners() {
        // Sipariş tamamlama butonu
        this.elements.submitOrderBtn.addEventListener('click', () => {
            this.viewModel.completeOrder();
        });
        
        // Oyunu yeniden başlatma butonu
        this.elements.restartGameBtn.addEventListener('click', () => {
            this.viewModel.restartGame();
        });
        
        // Dürümü döndürme efekti
        this.elements.durumWrapper.addEventListener('click', () => {
            this.elements.durumWrapper.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        });
    }

    /**
     * ViewModel callback'lerini ayarlar
     * @private
     */
    _setupViewModelCallbacks() {
        // Oyun durumu değiştiğinde
        this.viewModel.on('onGameStateChanged', (state) => {
            this._updateScoreDisplay(state.score);
            this._updateLevelDisplay(state.level);
        });
        
        // Sipariş başladığında
        this.viewModel.on('onOrderStarted', (order) => {
            this._clearDurum();
            this._updateOrderDisplay(order);
            
            // Sipariş başlangıç animasyonu
            this.elements.currentOrder.classList.add('bounce');
            setTimeout(() => {
                this.elements.currentOrder.classList.remove('bounce');
            }, 500);
        });
        
        // Sipariş tamamlandığında
        this.viewModel.on('onOrderCompleted', (result) => {
            this._showOrderResult(result);
        });
        
        // Malzeme eklendiğinde
        this.viewModel.on('onIngredientAdded', (ingredient) => {
            this._addIngredientToDurum(ingredient);
        });
        
        // Malzeme çıkarıldığında
        this.viewModel.on('onIngredientRemoved', (ingredientId) => {
            this._removeIngredientFromDurum(ingredientId);
        });
        
        // Oyun bittiğinde
        this.viewModel.on('onGameOver', (result) => {
            this._showGameOverPanel(result.totalScore);
        });
        
        // Zamanlayıcı güncellendiğinde
        this.viewModel.on('onTimerUpdate', (timeLeft) => {
            this._updateTimerDisplay(timeLeft);
        });
        
        // Süre bittiğinde
        this.viewModel.on('onTimeUp', () => {
            // Süre bitti animasyonu
            this.elements.timerDisplay.classList.add('bounce');
            setTimeout(() => {
                this.elements.timerDisplay.classList.remove('bounce');
            }, 500);
        });
    }

    /**
     * Malzeme butonlarını oluşturur
     * @param {Array<Ingredient>} ingredients - Kullanılabilir malzemeler
     * @private
     */
    _renderIngredientButtons(ingredients) {
        // Mevcut butonları temizle
        this.elements.ingredientsContainer.innerHTML = '';
        
        // Her malzeme için buton oluştur
        ingredients.forEach(ingredient => {
            // Artık lavaş da gösteriliyor, if kontrolünü kaldırdık
            
            const button = document.createElement('button');
            button.className = 'ingredient-btn';
            button.dataset.ingredientId = ingredient.id;
            
            // Malzeme görseli varsa ekle
            if (ingredient.image) {
                const img = document.createElement('img');
                img.src = ingredient.image;
                img.alt = ingredient.name;
                button.appendChild(img);
            }
            
            // Malzeme adını ekle
            const nameSpan = document.createElement('span');
            nameSpan.textContent = ingredient.name;
            button.appendChild(nameSpan);
            
            // Tıklama olayını ekle
            button.addEventListener('click', () => {
                this.viewModel.addIngredient(ingredient.id);
                
                // Tıklama animasyonu
                button.classList.add('bounce');
                setTimeout(() => {
                    button.classList.remove('bounce');
                }, 300);
            });
            
            this.elements.ingredientsContainer.appendChild(button);
        });
    }

    /**
     * Dürüme malzeme ekler
     * @param {Ingredient} ingredient - Eklenecek malzeme
     * @private
     */
    _addIngredientToDurum(ingredient) {
        // Malzeme elementi oluştur
        const ingredientElement = document.createElement('div');
        ingredientElement.className = 'ingredient';
        ingredientElement.dataset.ingredientId = ingredient.id;
        
        // Malzemelerin üst üste gelmemesi için pozisyon sınıflarını kullan
        // Dürümdeki mevcut malzeme sayısını al
        const currentIngredients = this.elements.durum.querySelectorAll('.ingredient');
        const positionIndex = (currentIngredients.length % 15) + 1; // 15 farklı pozisyon tanımladık
        
        // Pozisyon sınıfını ekle
        ingredientElement.classList.add(`ingredient-pos-${positionIndex}`);
        
        // Malzeme görseli varsa ekle
        if (ingredient.image) {
            const img = document.createElement('img');
            img.src = ingredient.image;
            img.alt = ingredient.name;
            img.style.width = '100%';
            img.style.height = 'auto';
            ingredientElement.appendChild(img);
        } else {
            // Görsel yoksa renk ile temsil et
            ingredientElement.style.backgroundColor = this._getIngredientColor(ingredient.id);
            ingredientElement.style.width = '80px';
            ingredientElement.style.height = '80px';
            ingredientElement.style.borderRadius = '50%';
            ingredientElement.textContent = ingredient.name;
        }
        
        // Tıklama olayı ekle (malzemeyi kaldırmak için)
        ingredientElement.addEventListener('click', () => {
            this.viewModel.removeIngredient(ingredient.id);
        });
        
        // Dürüme ekle
        this.elements.durum.appendChild(ingredientElement);
        
        // Ekleme animasyonu
        ingredientElement.classList.add('bounce');
        setTimeout(() => {
            ingredientElement.classList.remove('bounce');
        }, 500);
    }

    /**
     * Malzeme ID'sine göre renk döndürür
     * @param {string} ingredientId - Malzeme ID'si
     * @returns {string} Renk kodu
     * @private
     */
    _getIngredientColor(ingredientId) {
        const colors = {
            meat: '#a52a2a',
            chicken: '#f5deb3',
            lettuce: '#90ee90',
            tomato: '#ff6347',
            onion: '#d8bfd8',
            pepper: '#228b22',
            cheese: '#f0e68c',
            pickle: '#32cd32',
            sauce: '#ff4500',
            spice: '#8b4513'
        };
        
        return colors[ingredientId] || '#cccccc';
    }

    /**
     * Dürümden malzeme çıkarır
     * @param {string} ingredientId - Çıkarılacak malzeme ID'si
     * @private
     */
    _removeIngredientFromDurum(ingredientId) {
        const ingredientElement = this.elements.durum.querySelector(`[data-ingredient-id="${ingredientId}"]`);
        if (ingredientElement) {
            // Çıkarma animasyonu
            ingredientElement.style.transform += ' scale(0)';
            ingredientElement.style.opacity = '0';
            
            // Animasyon bittikten sonra elementi kaldır
            setTimeout(() => {
                ingredientElement.remove();
            }, 300);
        }
    }

    /**
     * Dürümdeki tüm malzemeleri temizler
     * @private
     */
    _clearDurum() {
        // Tüm malzemeleri temizle
        while (this.elements.durum.firstChild) {
            this.elements.durum.removeChild(this.elements.durum.firstChild);
        }
        
        // Dürümü sıfırla
        this.elements.durumWrapper.style.transform = 'rotate(0deg)';
    }

    /**
     * Sipariş bilgisini günceller
     * @param {Order} order - Sipariş
     * @private
     */
    _updateOrderDisplay(order) {
        this.elements.currentOrder.innerHTML = '';
        
        // Sipariş başlığı - daha kompakt
        const orderTitle = document.createElement('h3');
        orderTitle.textContent = 'Müşteri İstiyor:';
        this.elements.currentOrder.appendChild(orderTitle);
        
        // Müşteri yorumu - daha kompakt
        if (order.customerComment) {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'customer-comment';
            commentDiv.textContent = order.customerComment;
            this.elements.currentOrder.appendChild(commentDiv);
        }
        
        // Sipariş malzemeleri - daha kompakt bir liste
        const ingredientsList = document.createElement('div');
        ingredientsList.className = 'ingredients-grid';
        
        order.requiredIngredients.forEach(ingredientId => {
            const ingredient = this.viewModel.orderService.getIngredientById(ingredientId);
            if (ingredient) {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                
                // Malzeme görseli varsa ekle
                if (ingredient.image) {
                    const img = document.createElement('img');
                    img.src = ingredient.image;
                    img.alt = ingredient.name;
                    orderItem.appendChild(img);
                }
                
                // Malzeme adını ekle
                const nameSpan = document.createElement('span');
                nameSpan.textContent = ingredient.name;
                orderItem.appendChild(nameSpan);
                
                ingredientsList.appendChild(orderItem);
            }
        });
        
        this.elements.currentOrder.appendChild(ingredientsList);
    }

    /**
     * Puan göstergesini günceller
     * @param {number} score - Güncel puan
     * @private
     */
    _updateScoreDisplay(score) {
        this.elements.scoreDisplay.textContent = score;
        
        // Puan animasyonu
        this.elements.scoreDisplay.classList.add('bounce');
        setTimeout(() => {
            this.elements.scoreDisplay.classList.remove('bounce');
        }, 300);
    }
    
    /**
     * Seviye göstergesini günceller
     * @param {number} level - Güncel seviye
     * @private
     */
    _updateLevelDisplay(level) {
        this.elements.levelDisplay.textContent = level;
    }

    /**
     * Zamanlayıcı göstergesini günceller
     * @param {number} timeLeft - Kalan süre (saniye)
     * @private
     */
    _updateTimerDisplay(timeLeft) {
        this.elements.timerDisplay.textContent = timeLeft;
        
        // Süre azaldıkça rengi değiştir
        if (timeLeft <= 10) {
            this.elements.timerDisplay.style.color = 'red';
            
            // Son 5 saniyede yanıp sönme efekti
            if (timeLeft <= 5) {
                this.elements.timerDisplay.style.animation = 'blink 0.5s infinite';
            }
        } else {
            this.elements.timerDisplay.style.color = '#d35400';
            this.elements.timerDisplay.style.animation = 'none';
        }
    }

    /**
     * Sipariş sonucunu gösterir
     * @param {Object} result - Sipariş değerlendirme sonucu
     * @private
     */
    _showOrderResult(result) {
        // Sonuç mesajı oluştur
        const resultMessage = document.createElement('div');
        resultMessage.className = 'order-result';
        resultMessage.style.position = 'fixed';
        resultMessage.style.top = '50%';
        resultMessage.style.left = '50%';
        resultMessage.style.transform = 'translate(-50%, -50%)';
        resultMessage.style.backgroundColor = result.success ? 'rgba(46, 204, 113, 0.9)' : 'rgba(231, 76, 60, 0.9)';
        resultMessage.style.color = 'white';
        resultMessage.style.padding = '20px';
        resultMessage.style.borderRadius = '10px';
        resultMessage.style.textAlign = 'center';
        resultMessage.style.zIndex = '50';
        resultMessage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        resultMessage.style.fontSize = '1.5rem';
        
        // Mesaj içeriği
        resultMessage.innerHTML = `
            <h3>${result.success ? 'Harika!' : 'Üzgünüm!'}</h3>
            <p>${result.message}</p>
            <p>Kazanılan Puan: ${result.points}</p>
            ${result.success ? `<p>Zaman Bonusu: +${result.timeBonus}</p>` : ''}
        `;
        
        // Mesajı ekle
        document.body.appendChild(resultMessage);
        
        // Mesajı belirli bir süre sonra kaldır
        setTimeout(() => {
            resultMessage.style.opacity = '0';
            resultMessage.style.transform = 'translate(-50%, -50%) scale(0.8)';
            resultMessage.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                resultMessage.remove();
            }, 500);
        }, 2000);
    }

    /**
     * Oyun sonu panelini gösterir
     * @param {number} finalScore - Final puanı
     * @private
     */
    _showGameOverPanel(finalScore) {
        this.elements.finalScoreDisplay.textContent = finalScore;
        this.elements.gameOverPanel.classList.remove('hidden');
        
        // Animasyon efekti
        this.elements.gameOverPanel.style.opacity = '0';
        this.elements.gameOverPanel.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.elements.gameOverPanel.style.opacity = '1';
            this.elements.gameOverPanel.style.transform = 'scale(1)';
            this.elements.gameOverPanel.style.transition = 'all 0.5s ease';
        }, 100);
    }

    /**
     * Oyun sonu panelini gizler
     * @private
     */
    _hideGameOverPanel() {
        this.elements.gameOverPanel.classList.add('hidden');
    }
} 