let products = [];
let currentFilter = 'all';
let currentProduct = null;
let currentImageIndex = 0;

// Форматирование цены в рубли
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽';
}

// Загрузка товаров
function loadProducts() {
    const stored = localStorage.getItem('shopProducts');
    if (stored) {
        try {
            products = JSON.parse(stored);
            // Убеждаемся, что у каждого товара есть все поля
            products = products.map(p => ({
                ...p,
                images: p.images || [p.img || 'https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=800'],
                specs: p.specs || {},
                tags: p.tags || [],
                inStock: p.inStock !== undefined ? p.inStock : true
            }));
        } catch (e) {
            products = getDefaultProducts();
        }
    } else {
        products = getDefaultProducts();
    }
    renderProducts(products, true);
}

function getDefaultProducts() {
    const defaults = [
        { 
            id: 1, 
            name: 'Burton Custom', 
            price: 49900, 
            category: 'boards', 
            desc: 'Универсальная доска для фрирайда и парка.', 
            images: ['https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=800'],
            inStock: true,
            tags: ['хит'],
            specs: { flex: 'Средняя 5/10', size: '158 см', color: 'Синий' }
        },
        { 
            id: 2, 
            name: 'DC Phase BOA', 
            price: 27900, 
            category: 'boots', 
            desc: 'Ботинки с системой быстрой шнуровки BOA.', 
            images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
            inStock: true,
            tags: ['новинка'],
            specs: { flex: 'Средняя', size: '42', color: 'Чёрный' }
        },
        { 
            id: 3, 
            name: 'Union Force', 
            price: 19900, 
            category: 'bindings', 
            desc: 'Надёжные крепления для любого стиля.', 
            images: ['https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800'],
            inStock: true,
            tags: ['хит'],
            specs: { flex: 'Жёсткая', size: 'M', color: 'Серый' }
        }
    ];
    localStorage.setItem('shopProducts', JSON.stringify(defaults));
    return defaults;
}

function renderProducts(items, animate = true) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    if (!items || items.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);padding:40px 0;">Товары временно отсутствуют</p>';
        return;
    }
    
    if (animate) {
        grid.innerHTML = Array(Math.min(items.length, 6)).fill(0).map(() => `
            <div class="skeleton">
                <div class="skeleton-image"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
            </div>
        `).join('');
        
        setTimeout(() => {
            renderProducts(items, false);
        }, 300);
        return;
    }
    
    grid.innerHTML = items.map((p, index) => {
        let tagsHtml = '';
        if (p.tags && p.tags.length > 0) {
            tagsHtml = p.tags.map(tag => {
                const colors = {
                    'хит': '#ff6b35',
                    'новинка': '#34c759',
                    'премиум': '#af52de',
                    'популярный': '#007aff',
                    'скидка': '#ff3b30'
                };
                const color = colors[tag] || '#8e8e93';
                return `<span style="background:${color}20;color:${color};padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;margin-right:4px;">${tag.toUpperCase()}</span>`;
            }).join('');
        }
        
        const stockHtml = p.inStock !== undefined ? `
            <span style="color:${p.inStock ? '#34c759' : '#ff3b30'};font-size:12px;font-weight:500;">
                ${p.inStock ? '● В наличии' : '● Нет в наличии'}
            </span>
        ` : '';
        
        const imgSrc = p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400';
        
        return `
            <div class="product-card" style="animation-delay: ${(index * 0.05).toFixed(2)}s;" onclick="openProductModal(${p.id})">
                <img src="${imgSrc}" class="product-image" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400'">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;margin-bottom:4px;">
                    <div class="product-name">${p.name}</div>
                </div>
                <div class="product-price">${formatPrice(p.price)}</div>
                <div class="product-desc">${p.desc || 'Без описания'}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                    <div>${tagsHtml}</div>
                    ${stockHtml}
                </div>
            </div>
        `;
    }).join('');
}

// Фильтр по категориям
document.querySelectorAll('.cat').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.cat').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.cat;
        
        const filtered = currentFilter === 'all' 
            ? products 
            : products.filter(p => p.category === currentFilter);
        
        renderProducts(filtered, true);
    });
});

// Модальное окно товара
function openProductModal(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;
    
    currentImageIndex = 0;
    const modal = document.getElementById('productModal');
    
    document.getElementById('modalName').textContent = currentProduct.name;
    document.getElementById('modalPrice').textContent = formatPrice(currentProduct.price);
    document.getElementById('modalDesc').textContent = currentProduct.desc || 'Без описания';
    
    // Характеристики
    const specsContainer = document.getElementById('modalSpecs');
    const specs = currentProduct.specs || {};
    const specItems = [];
    
    if (specs.flex) specItems.push({ label: 'Жёсткость', value: specs.flex });
    if (specs.size) specItems.push({ label: 'Размер', value: specs.size });
    if (specs.color) specItems.push({ label: 'Цвет', value: specs.color });
    
    if (specItems.length > 0) {
        specsContainer.innerHTML = specItems.map(s => `
            <span class="spec">
                <span class="label">${s.label}:</span>
                <span class="value">${s.value}</span>
            </span>
        `).join('');
        specsContainer.style.display = 'flex';
    } else {
        specsContainer.style.display = 'none';
    }
    
    // Теги
    const tagsContainer = document.getElementById('modalTags');
    if (currentProduct.tags && currentProduct.tags.length > 0) {
        const colors = {
            'хит': '#ff6b35',
            'новинка': '#34c759',
            'премиум': '#af52de',
            'популярный': '#007aff'
        };
        tagsContainer.innerHTML = currentProduct.tags.map(tag => {
            const color = colors[tag] || '#8e8e93';
            return `<span class="modal-tag" style="background:${color}20;color:${color};">${tag}</span>`;
        }).join('');
    } else {
        tagsContainer.innerHTML = '';
    }
    
    // Наличие
    const stockContainer = document.getElementById('modalStock');
    if (currentProduct.inStock !== undefined) {
        stockContainer.textContent = currentProduct.inStock ? '● В наличии' : '● Нет в наличии';
        stockContainer.style.color = currentProduct.inStock ? '#34c759' : '#ff3b30';
        stockContainer.style.display = 'block';
    } else {
        stockContainer.style.display = 'none';
    }
    
    // Изображения
    updateModalImage();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
}

function updateModalImage() {
    const images = currentProduct.images || ['https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=800'];
    const imgElement = document.getElementById('modalImage');
    imgElement.src = images[currentImageIndex] || images[0];
    imgElement.alt = currentProduct.name;
    
    document.getElementById('modalImageCounter').textContent = `${currentImageIndex + 1} / ${images.length}`;
    
    const nav = document.querySelector('.modal-image-nav');
    if (images.length <= 1) {
        nav.style.display = 'none';
    } else {
        nav.style.display = 'flex';
    }
}

function changeImage(direction) {
    const images = currentProduct.images || ['https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=800'];
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    updateModalImage();
}

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
    if (e.key === 'ArrowLeft' && document.getElementById('productModal').classList.contains('active')) {
        changeImage(-1);
    }
    if (e.key === 'ArrowRight' && document.getElementById('productModal').classList.contains('active')) {
        changeImage(1);
    }
});

// Синхронизация между вкладками
window.addEventListener('storage', (e) => {
    if (e.key === 'shopProducts') {
        try {
            products = JSON.parse(e.newValue);
            const filtered = currentFilter === 'all' 
                ? products 
                : products.filter(p => p.category === currentFilter);
            renderProducts(filtered, true);
        } catch (e) {}
    }
});

// Загрузка
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
