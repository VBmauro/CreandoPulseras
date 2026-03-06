const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxYAv5_PQcYRtLinlyFny3vcabcC2WCN-eD476i7dCyBmLYw-LOBx5i8lHwqYKTuPpUrg/exec";

let products = [];
let cart = [];

async function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return; 

    container.innerHTML = '<p style="text-align:center; width:100%;">Cargando catálogo...</p>';

    try {
        const response = await fetch(SCRIPT_URL);
        products = await response.json();
        renderProducts();
    } catch (error) {
        container.innerHTML = '<p>Error al cargar productos.</p>';
    }
}

function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const price = parseFloat(product.price) || 0;
        
        card.innerHTML = `
            <img src="${product.image}" alt="Pulsera">
            <h3>SKU: ${product.sku}</h3>
            <p>${product.description}</p>
            <small>Medida: ${product.measurements} | Stock: ${product.stock}</small>
            <h4>$${price.toFixed(2)}</h4>
            <div class="add-to-cart-container" style="display: flex; gap: 10px; margin-top: 10px;">
                <input type="number" id="qty-${product.sku}" value="1" min="1" class="qty-input" style="width: 50px; padding: 5px;">
                <button onclick="addToCart('${product.sku}')" style="flex-grow: 1;">Añadir</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('hidden');
}

function addToCart(sku) {
    const product = products.find(p => String(p.sku) === String(sku));
    const qtyInput = document.getElementById(`qty-${sku}`);
    const cantidad = parseInt(qtyInput.value) || 1;

    if (product) {
        const itemEnCarrito = cart.find(item => String(item.sku) === String(sku));
        if (itemEnCarrito) {
            itemEnCarrito.cantidad += cantidad;
        } else {
            cart.push({ ...product, cantidad: cantidad });
        }
        updateCartUI();
        alert("¡Producto añadido!");
    }
}

function updateCartUI() {
    const itemsDisplay = document.getElementById('cart-items');
    const subtotalDisplay = document.getElementById('subtotal-price');
    const totalDisplay = document.getElementById('total-price');
    const countDisplay = document.getElementById('cart-count');
    
    itemsDisplay.innerHTML = '';
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const totalFila = item.price * item.cantidad;
        subtotal += totalFila;
        totalItems += item.cantidad;
        itemsDisplay.innerHTML += `<p>▪️ ${item.cantidad}x ${item.sku} - $${totalFila.toFixed(2)}</p>`;
    });

    const envio = 50.0;
    countDisplay.innerText = totalItems;
    subtotalDisplay.innerText = subtotal.toFixed(2);
    totalDisplay.innerText = cart.length > 0 ? (subtotal + envio).toFixed(2) : "0.00";
}

function checkout() {
    if (cart.length === 0) return alert("Carrito vacío");

    const nombre = document.getElementById('customer-name').value.trim();
    const tel = document.getElementById('customer-phone').value.trim();
    const cp = document.getElementById('customer-cp').value.trim(); // Lee el C.P.
    const dir = document.getElementById('customer-address').value.trim();

    if (!nombre || !tel || !cp || !dir) return alert("Completa todos los datos de envío");

    const miWhatsApp = "9813493773"; // RECUERDA PONER TU NÚMERO

    let mensaje = `¡Hola! Quiero confirmar mi pedido:\n\n`;
    let subtotal = 0;

    cart.forEach(item => {
        const totalFila = item.price * item.cantidad;
        mensaje += `▪️ ${item.cantidad}x SKU: ${item.sku} ($${totalFila.toFixed(2)})\n`;
        subtotal += totalFila;
    });

    mensaje += `\n📦 Subtotal: $${subtotal.toFixed(2)}`;
    mensaje += `\n🚚 Envío (MEXPOST): $50.00`;
    mensaje += `\n💰 TOTAL: $${(subtotal + 50).toFixed(2)}\n\n`;
    mensaje += `📍 DATOS:\n👤 ${nombre}\n📞 ${tel}\n📮 C.P.: ${cp}\n🏠 ${dir}`;

    window.open(`https://wa.me/${miWhatsApp}?text=${encodeURIComponent(mensaje)}`, '_blank');
}


loadProducts();
