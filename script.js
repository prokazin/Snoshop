let products = [];
let currentFilter = 'all';

// Загрузка товаров
function loadProducts() {
    const stored = localStorage.getItem('shopProducts');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = [
            { 
                id: 1, 
                name: 'Burton Custom', 
                price: 499, 
                category: 'boards', 
                desc: 'Универсальная доска для фрирайда и парка', 
                img: 'https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400',
                rating: 4.8,
                inStock: true,
                tags: ['хит', 'популярный']
            },
            { 
                id: 2, 
                name: 'DC Phase BOA', 
                price: 279, 
                category: 'boots', 
                desc: 'Ботинки с системой быстрой шнуровки BOA', 
                img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
                rating: 4.5,
                inStock: true,
                tags: ['новинка']
            },
            { 
                id: 3, 
                name: 'Union Force', 
                price: 199, 
                category: 'bindings', 
                desc: 'Надёжные крепления для любого стиля', 
                img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
                rating: 4.7,
                inStock: true,
                tags: ['хит']
            },
            { 
                id: 4, 
                name: 'Jones Mountain Twin', 
                price: 599, 
                category: 'boards', 
                desc: 'Профессиональная доска для бэккантри', 
                img: 'https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400',
                rating: 4.9,
                inStock: false,
                tags: ['премиум']
            },
            { 
                id: 5, 
                name: 'Volcom Outerwear', 
                price: 189, 
                category: 'clothes', 
                desc: 'Водонепроницаемая куртка для сноуборда', 
                img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
                rating: 4.3,
                inStock: true,
                tags: ['новинка']
            },
            { 
                id: 6, 
                name: 'Oakley Goggles', 
                price: 149, 
                category: 'clothes', 
                desc: 'Маска с PRIZM-линзами для чёткого обзора', 
                img: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
                rating: 4.6,
                inStock: true,
                tags: []
            }
        ];
        localStorage.setItem('shopProducts', JSON.stringify(products));
    }
    renderProducts(products, true);
}

function renderProducts(items, animate = true) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    if (items.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);padding:40px 0;">Товары временно отсутствуют</p>';
        return;
    }
    
    // Показываем скелетоны на 300мс (для плавности)
    if (animate) {
        grid.innerHTML = Array(6).fill(0).map(() => `
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
        // Метки
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
        
        // Наличие
        const stockHtml = p.inStock !== undefined ? `
            <span style="color:${p.inStock ? '#34c759' : '#ff3b30'};font-size:12px;font-weight:500;">
                ${p.inStock ? '● В наличии' : '● Нет в наличии'}
            </span>
        ` : '';
        
        // Рейтинг
        const ratingHtml = p.rating ? `
            <span style="color:#ff9500;font-size:14px;">★ ${p.rating}</span>
        ` : '';
        
        return `
            <div class="product-card" style="animation-delay: ${(index * 0.05).toFixed(2)}s;">
                <img src="${p.img}" class="product-image" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400'">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;margin-bottom:4px;">
                    <div class="product-name">${p.name}</div>
                    ${ratingHtml}
                </div>
                <div class="product-price">$${p.price}</div>
                <div class="product-desc">${p.desc}</div>
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

// Синхронизация между вкладками
window.addEventListener('storage', (e) => {
    if (e.key === 'shopProducts') {
        products = JSON.parse(e.newValue);
        const filtered = currentFilter === 'all' 
            ? products 
            : products.filter(p => p.category === currentFilter);
        renderProducts(filtered, true);
    }
});

// Загрузка
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
