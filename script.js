let products = [];

// Загрузка товаров
function loadProducts() {
    const stored = localStorage.getItem('shopProducts');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        // Дефолтные товары
        products = [
            { 
                id: 1, 
                name: 'Burton Custom', 
                price: 499, 
                category: 'boards', 
                desc: 'Универсальная доска для фрирайда и парка', 
                img: 'https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400' 
            },
            { 
                id: 2, 
                name: 'DC Phase BOA', 
                price: 279, 
                category: 'boots', 
                desc: 'Ботинки с системой быстрой шнуровки BOA', 
                img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' 
            },
            { 
                id: 3, 
                name: 'Union Force', 
                price: 199, 
                category: 'bindings', 
                desc: 'Надёжные крепления для любого стиля', 
                img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400' 
            },
            { 
                id: 4, 
                name: 'Jones Mountain Twin', 
                price: 599, 
                category: 'boards', 
                desc: 'Профессиональная доска для бэккантри', 
                img: 'https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400' 
            }
        ];
        localStorage.setItem('shopProducts', JSON.stringify(products));
    }
    renderProducts(products);
}

function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    if (items.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);padding:40px 0;">Товары временно отсутствуют</p>';
        return;
    }
    
    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <img src="${p.img}" class="product-image" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400'">
            <div class="product-name">${p.name}</div>
            <div class="product-price">$${p.price}</div>
            <div class="product-desc">${p.desc}</div>
        </div>
    `).join('');
}

// Фильтр по категориям
document.querySelectorAll('.cat').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.cat').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const cat = this.dataset.cat;
        if (cat === 'all') {
            renderProducts(products);
        } else {
            renderProducts(products.filter(p => p.category === cat));
        }
    });
});

// Загрузка
document.addEventListener('DOMContentLoaded', loadProducts);
