/**
 * Dürüm Efsanesi - Ana Uygulama Dosyası
 * MVVM mimarisi kullanılarak geliştirilmiştir.
 */

// Sayfa yüklendiğinde oyunu başlat
document.addEventListener('DOMContentLoaded', () => {
    // Kullanılabilir malzemeleri tanımla
    const ingredients = [
        new Ingredient('lavash', 'Lavaş', 'Assets/images/lavash.png', 5), // Lavaş artık seçilebilir bir malzeme
        new Ingredient('meat', 'Et', 'Assets/images/meat.png', 20),
        new Ingredient('chicken', 'Tavuk', 'Assets/images/chicken.png', 15),
        new Ingredient('lettuce', 'Marul', 'Assets/images/lettuce.png', 5),
        new Ingredient('tomato', 'Domates', 'Assets/images/tomato.png', 5),
        new Ingredient('onion', 'Soğan', 'Assets/images/onion.png', 5),
        new Ingredient('pepper', 'Biber', 'Assets/images/pepper.png', 10),
        new Ingredient('cheese', 'Peynir', 'Assets/images/cheese.png', 15),
        new Ingredient('pickle', 'Turşu', 'Assets/images/pickle.png', 10),
        new Ingredient('sauce', 'Sos', 'Assets/images/sauce.png', 10),
        new Ingredient('spice', 'Baharat', 'Assets/images/spice.png', 5)
    ];
    
    // Ses efektlerini yükle
    const sounds = {
        addIngredient: new Audio('Assets/sounds/add_ingredient.mp3'),
        removeIngredient: new Audio('Assets/sounds/remove_ingredient.mp3'),
        orderSuccess: new Audio('Assets/sounds/order_success.mp3'),
        orderFail: new Audio('Assets/sounds/order_fail.mp3'),
        gameOver: new Audio('Assets/sounds/game_over.mp3'),
        background: new Audio('Assets/sounds/background_music.mp3')
    };
    
    // Arka plan müziğini ayarla
    sounds.background.loop = true;
    sounds.background.volume = 0.3;
    
    // MVVM mimarisini oluştur
    const gameModel = new Game(10); // 10 turlu oyun
    const orderService = new OrderService(ingredients);
    const gameViewModel = new GameViewModel(gameModel, orderService, sounds);
    const gameView = new GameView(gameViewModel);
    
    // Oyunu başlat
    gameView.startGame(ingredients);
    
    // Arka plan müziğini başlat (kullanıcı etkileşimi gerektirir)
    document.addEventListener('click', () => {
        sounds.background.play().catch(e => console.log('Ses çalınamadı:', e));
    }, { once: true });
    
    // Konsola erişim için global değişkenler (geliştirme amaçlı)
    window.gameModel = gameModel;
    window.gameViewModel = gameViewModel;
    window.gameView = gameView;
}); 