// Simulando la base de datos de tus productos
const products = [
    {
        sku: "PLS-001",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
        description: "Color perla con acentos sutiles en dorado. Composición limpia.",
        measurements: "18cm (Ajustable)",
        price: 450.00,
        stock: 5
    }
];

let cart = [];

// Mostrar productos en la tienda
function renderProducts() {
    const container = document.getElementById('products-container');
    if(!container) return; // Evita error si estamos en el panel de admin
    
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="Pulsera">
            <h3>SKU: ${product.sku}</h3>
            <p>${product.description}</p>
            <small>Medida: ${product.measurements} | Stock: ${product.stock}</small>
            <h4>$${product.price.toFixed(2)}</h4>
            <button onclick="addToCart('${product.sku}')">Añadir al Carrito</button>
        `;
        container.appendChild(card);
    });
}

// Funciones del Carrito
function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('hidden');
}

function addToCart(sku) {
    const product = products.find(p => p.sku === sku);
    cart.push(product);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        cartItems.innerHTML += `<p>${item.sku} - $${item.price}</p>`;
    });
    document.getElementById('total-price').innerText = total.toFixed(2);
}

// Iniciar la tienda
renderProducts();