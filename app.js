const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwr5tNRso27ZxTH3sn_zHNEc_xwxFJS06DQg2D6FyyiUWQKAR38Xy2_TjG8UmxMfOEqQg/exec"; // <--- PEGA AQUÍ LA URL NUEVA

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
        container.innerHTML = '<p style="text-align:center; width:100%;">Error de conexión. Revisa el despliegue del Script.</p>';
        console.error(error);
    }
}

function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const precio = parseFloat(product.price) || 0;
        card.innerHTML = `
            <img src="${product.image}" alt="Pulsera" onclick="openZoom(this.src)">
            <h3>SKU: ${product.sku}</h3>
            <p>${product.description}</p>
            <small>${product.measurements} | Stock: ${product.stock}</small>
            <h4>$${precio.toFixed(2)}</h4>
            <div class="add-to-cart-container">
                <input type="number" id="qty-${product.sku}" value="1" min="1" class="qty-input">
                <button onclick="addToCart('${product.sku}')">Añadir</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleCart() { document.getElementById('cart-modal').classList.toggle('hidden'); }

function addToCart(sku) {
    const product = products.find(p => String(p.sku) === String(sku));
    const input = document.getElementById(`qty-${sku}`);
    const qty = parseInt(input.value) || 1;
    if (product) {
        const exist = cart.find(i => String(i.sku) === String(sku));
        if (exist) exist.cantidad += qty;
        else cart.push({ ...product, cantidad: qty });
        updateCartUI();
        alert("¡Añadido al carrito!");
        input.value = 1;
    }
}

function updateCartUI() {
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = '';
    let subtotal = 0;
    let totalQty = 0;
    cart.forEach(item => {
        const totalFila = item.price * item.cantidad;
        subtotal += totalFila;
        totalQty += item.cantidad;
        itemsDiv.innerHTML += `<p>▪️ ${item.cantidad}x ${item.sku} - $${totalFila.toFixed(2)}</p>`;
    });
    document.getElementById('cart-count').innerText = totalQty;
    document.getElementById('subtotal-price').innerText = subtotal.toFixed(2);
    document.getElementById('total-price').innerText = cart.length > 0 ? (subtotal + 50).toFixed(2) : "0.00";
}

function checkout() {
    if (cart.length === 0) return alert("Tu carrito está vacío.");
    const nom = document.getElementById('customer-name').value.trim();
    const tel = document.getElementById('customer-phone').value.trim();
    const cp = document.getElementById('customer-cp').value.trim();
    const dir = document.getElementById('customer-address').value.trim();
    if (!nom || !tel || !cp || !dir) return alert("Por favor, llena todos los datos de envío.");

    const formData = new URLSearchParams();
    formData.append('action', 'updateStock');
    formData.append('cart', JSON.stringify(cart));
    fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: formData });

    const miWA = "529813493773";
    let msg = `¡Hola CreandoPulseras! ✨ Confirmo mi pedido:\n\n`;
    let sub = 0;
    cart.forEach(i => {
        msg += `▪️ ${i.cantidad}x SKU: ${i.sku} ($${(i.price * i.cantidad).toFixed(2)})\n`;
        sub += i.price * i.cantidad;
    });
    msg += `\n💰 TOTAL: $${(sub + 50).toFixed(2)}\n📍 ENVÍO: ${nom}, CP ${cp}. ${dir}`;
    window.open(`https://wa.me/${miWA}?text=${encodeURIComponent(msg)}`, '_blank');
    
    cart = []; updateCartUI(); toggleCart();
}

function openZoom(src) { document.getElementById('zoomed-img').src = src; document.getElementById('zoom-modal').classList.remove('hidden'); }
function closeZoom() { document.getElementById('zoom-modal').classList.add('hidden'); }
function openContact() { document.getElementById('contact-modal').classList.remove('hidden'); }
function closeContact() { document.getElementById('contact-modal').classList.add('hidden'); }

// Manejo del Panel de Administración (si existe en la página)
const adminForm = document.getElementById('product-form');
if (adminForm) {
    adminForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append('sku', document.getElementById('sku').value);
        formData.append('image', document.getElementById('image-url').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('measurements', document.getElementById('measurements').value);
        formData.append('stock', document.getElementById('stock').value);
        formData.append('price', document.getElementById('price').value);

        fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: formData })
        .then(() => { alert("Producto Guardado"); adminForm.reset(); });
    });
}

loadProducts();