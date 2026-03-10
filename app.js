const SCRIPT_URL = "TU_URL_DE_GOOGLE_SCRIPT";

let products = [];
let cart = [];
const pastelColors = ['#FFF0F5', '#FFFDE7', '#E1F5FE', '#FFF3E0', '#F3E5F5', '#F1F8E9'];

async function loadProducts() {
    const container = document.getElementById('products-container');
    const visitCounter = document.getElementById('visit-counter');
    if (!container) return; 
    container.innerHTML = '<p style="text-align:center; width:100%;">Abriendo el joyero...</p>';
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        products = data.productos;
        renderProducts();
        if (visitCounter) visitCounter.innerText = `Visitas: ${data.visitas}`;
    } catch (error) {
        container.innerHTML = '<p>Error de conexión.</p>';
    }
}

function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    products.forEach(product => {
        const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.backgroundColor = randomColor;
        card.innerHTML = `
            <img src="${product.image}" onclick="openZoom(this.src)">
            <h3>SKU: ${product.sku}</h3>
            <p>${product.description}</p>
            <small>${product.measurements} | Stock: ${product.stock}</small>
            <h4 style="color:#d4af37; font-size:1.2rem;">$${parseFloat(product.price).toFixed(2)}</h4>
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
    const qty = parseInt(document.getElementById(`qty-${sku}`).value) || 1;
    if (product) {
        const exist = cart.find(i => String(i.sku) === String(sku));
        if (exist) exist.cantidad += qty;
        else cart.push({ ...product, cantidad: qty });
        updateCartUI();
        alert(`¡Añadido!`);
    }
}

function updateCartUI() {
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = '';
    let sub = 0, totalQty = 0;
    cart.forEach(item => {
        const total = item.price * item.cantidad;
        sub += total; totalQty += item.cantidad;
        itemsDiv.innerHTML += `<p>▪️ ${item.cantidad}x ${item.sku} - $${total.toFixed(2)}</p>`;
    });
    document.getElementById('cart-count').innerText = totalQty;
    document.getElementById('subtotal-price').innerText = sub.toFixed(2);
    document.getElementById('total-price').innerText = cart.length > 0 ? (sub + 50).toFixed(2) : "0.00";
}

function checkout() {
    if (cart.length === 0) return alert("Carrito vacío");
    const nom = document.getElementById('customer-name').value.trim();
    const tel = document.getElementById('customer-phone').value.trim();
    const cp = document.getElementById('customer-cp').value.trim();
    const dir = document.getElementById('customer-address').value.trim();
    if (!nom || !tel || !cp || !dir) return alert("Llena tus datos de envío.");

    const formData = new URLSearchParams();
    formData.append('action', 'updateStock');
    formData.append('cart', JSON.stringify(cart));
    fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: formData });

    const miWA = "[TuNúmero]";
    let msg = `¡Hola! Confirmo mi pedido:\n\n`;
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

loadProducts();