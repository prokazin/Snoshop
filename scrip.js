let products = [];
let cart = [];

// Загрузка товаров
async function loadProducts() {
    try {
        const res = await fetch('data.json');
        products = await res.json();
        renderProducts(products);
    } catch {
        // Если data.json нет - используем дефолтные
        products = defaultProducts();
        renderProducts(products);
    }
}

function defaultProducts() {
    return [
        { id: 1, name: 'Burton Custom', price: 499, category: 'boards', desc: 'Универсальная доска для фрирайда', img: 'https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400' },
        { id: 2, name: 'DC Phase BOA', price: 279, category: 'boots', desc: 'Комфортные ботинки с системой BOA', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
        { id: 3, name: 'Union Force', price: 199, category: 'bindings', desc: 'Надёжные крепления для фрирайда', img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400' }
    ];
}

function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <img src="${p.img}" class="product-image" alt="${p.name}">
            <div class="product-name">${p.name}</div>
            <div class="product-price">$${p.price}</div>
            <div class="product-desc">${p.desc}</div>
            <button class="add-btn" onclick="addToCart(${p.id})">Добавить в корзину</button>
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

// Корзина
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    document.getElementById('cartCount').textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
    renderCart();
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

function renderCart() {
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;">Корзина пуста</p>';
        return;
    }
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} × ${item.qty}</span>
            <span>$${item.price * item.qty}</span>
        </div>
    `).join('');
}

loadProducts();
