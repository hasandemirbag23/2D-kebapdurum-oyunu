/**
 * OrderService sınıfı - Sipariş oluşturma ve yönetme işlemlerini gerçekleştirir
 * SOLID prensiplerinden Single Responsibility Principle'a uygun olarak
 * sadece sipariş oluşturma ve yönetme işlemlerini gerçekleştirir.
 */
class OrderService {
    /**
     * OrderService oluşturucu
     * @param {Array<Ingredient>} availableIngredients - Kullanılabilir malzemeler
     */
    constructor(availableIngredients = []) {
        this.availableIngredients = availableIngredients;
        this.orderCounter = 0;
        
        // Müşteri isimleri
        this.customerNames = [
            'Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Veli', 'Zeynep', 
            'Mustafa', 'Kemal', 'Hasan', 'Hüseyin', 'İbrahim', 'Murat', 
            'Serkan', 'Pınar', 'Deniz', 'Ceren', 'Burak', 'Cem', 'Selin'
        ];
        
        // Müşteri yorumları - daha kısa ve öz
        this.customerComments = {
            easy: [
                'Basit bir dürüm lütfen.',
                'Hafif bir şey olsun.',
                'Sade bir dürüm istiyorum.',
                'Az malzeme olsun.'
            ],
            medium: [
                'Güzel bir dürüm olsun.',
                'Orta boy bir dürüm alayım.',
                'Tam kıvamında olsun.'
            ],
            hard: [
                'Dolu dolu bir dürüm olsun!',
                'En özel dürümünüzden!',
                'Tüm malzemelerden koyun!',
                'En iyisinden olsun!'
            ]
        };
    }

    /**
     * Kullanılabilir malzemeleri günceller
     * @param {Array<Ingredient>} ingredients - Yeni malzeme listesi
     */
    updateAvailableIngredients(ingredients) {
        this.availableIngredients = ingredients;
    }
    
    /**
     * ID'ye göre malzeme bulur
     * @param {string} id - Malzeme ID'si
     * @returns {Ingredient|null} Bulunan malzeme veya null
     */
    getIngredientById(id) {
        return this.availableIngredients.find(ingredient => ingredient.id === id) || null;
    }

    /**
     * Zorluk seviyesine göre sipariş oluşturur
     * @param {string} difficulty - Zorluk seviyesi (easy, medium, hard)
     * @returns {Order} Oluşturulan sipariş
     */
    createOrder(difficulty = 'medium') {
        this.orderCounter++;
        
        // Zorluk seviyesine göre parametreleri belirle
        let minIngredients, maxIngredients;
        
        switch (difficulty) {
            case 'easy':
                minIngredients = 3;
                maxIngredients = 5;
                break;
            case 'medium':
                minIngredients = 4;
                maxIngredients = 7;
                break;
            case 'hard':
                minIngredients = 6;
                maxIngredients = 9;
                break;
            default:
                minIngredients = 4;
                maxIngredients = 7;
        }
        
        // Rastgele malzeme sayısı belirle
        const ingredientCount = Math.floor(
            Math.random() * (maxIngredients - minIngredients + 1) + minIngredients
        );

        // Kullanılabilir malzemelerin kopyasını oluştur (artık lavaş da dahil)
        const ingredientPool = [...this.availableIngredients];
        const selectedIngredients = [];
        
        // Rastgele malzemeleri seç
        for (let i = 0; i < ingredientCount && ingredientPool.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * ingredientPool.length);
            const selectedIngredient = ingredientPool.splice(randomIndex, 1)[0];
            selectedIngredients.push(selectedIngredient.id);
        }
        
        // Eğer lavaş seçilmediyse ve zorluk seviyesi medium veya hard ise
        // %70 ihtimalle lavaş ekle (müşteriler genelde lavaş ister)
        if (!selectedIngredients.includes('lavash') && (difficulty === 'medium' || difficulty === 'hard')) {
            if (Math.random() < 0.7) {
                selectedIngredients.push('lavash');
            }
        }
        
        // Rastgele müşteri adı seç
        const customerName = this.customerNames[Math.floor(Math.random() * this.customerNames.length)];
        
        // Zorluk seviyesine göre yorum seç
        const comments = this.customerComments[difficulty];
        const comment = comments[Math.floor(Math.random() * comments.length)];
        
        // Sipariş nesnesi oluştur - daha kısa müşteri yorumu formatı
        const order = new Order(
            `order_${this.orderCounter}`,
            selectedIngredients,
            `${customerName}: ${comment}`
        );
        
        return order;
    }
    
    /**
     * Sipariş açıklaması oluşturur
     * @param {Order} order - Sipariş
     * @returns {string} Sipariş açıklaması
     */
    createOrderDescription(order) {
        if (!order) {
            return "Sipariş bilgisi yok";
        }
        
        // Müşteri yorumu varsa göster
        if (order.customerComment) {
            return order.customerComment;
        }
        
        // Yoksa malzeme listesini göster
        const ingredientNames = order.requiredIngredients.map(id => {
            const ingredient = this.getIngredientById(id);
            return ingredient ? ingredient.name : id;
        });
        
        return `Sipariş: ${ingredientNames.join(', ')}`;
    }
} 