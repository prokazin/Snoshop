// Загружаем товары из localStorage или data.json
let products = [];

async function loadAdminProducts() {
    const stored = localStorage.getItem('shopProducts');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        try {
            const res = await fetch('data.json');
            products = await res.json();
            localStorage.setItem('shopProducts', JSON.stringify(products));
        } catch {
            products = [
                { id: 1, name: 'Burton Custom', price: 499, category: 'boards', desc: 'Универсальная доска', img: 'https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400' }
            ];
            localStorage.setItem('shopProducts', JSON.stringify(products));
        }
    }
    renderAdminList();
}

function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const img = document.getElementById('productImg').value;
    const desc = document.getElementById('productDesc').value;

    if (!name || !price) {
        alert('Заполните название и цену');
        return;
    }

    const newProduct = {
        id: Date.now(),
        name,
        price,
        category,
        img: img || 'https://images.unsplash.com/photo-1551503766-ac63dfa6401c?w=400',
        desc: desc || 'Описание отсутствует'
    };

    products.push(newProduct);
    localStorage.setItem('shopProducts', JSON.stringify(products));
    renderAdminList();
    clearForm();
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem('shopProducts', JSON.stringify(products));
    renderAdminList();
}

function renderAdminList() {
    const list = document.getElementById('adminProductList');
    list.innerHTML = products.map(p => `
        <div class="admin-item">
            <span>${p.name} - $${p.price}</span>
            <button onclick="deleteProduct(${p.id})">🗑️</button>
        </div>
    `).join('');
}

function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productImg').value = '';
    document.getElementById('productDesc').value = '';
}

// Синхронизация для магазина
window.addEventListener('storage', () => {
    const updated = localStorage.getItem('shopProducts');
    if (updated) {
        products = JSON.parse(updated);
        renderAdminList();
    }
});

loadAdminProducts();
