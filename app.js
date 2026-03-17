const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxihChz7LBFhsbTyvdCoInpkdLnAmtFj3NMxJ6GzkVaHR6Chgz5yjmTgcGfd5amD-6wJQ/exec";

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
        container.innerHTML = '<p>Error de conexión con el catálogo.</p>';
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
    // Corrección aquí: se usaba "subtotal" que no estaba definida, lo cambié por "sub"
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

    const miWA = "529813493773";
    let msg = `¡Hola CreandoPulseras! ✨ Confirmo pedido:\n\n`;
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

// --- LÓGICA NUEVA: ARMAR PULSERA ---
let customSelections = { base: '', sec: '' };

function openCustomizer() { 
    document.getElementById('custom-modal').classList.remove('hidden'); 
}

function closeCustomizer() { 
    document.getElementById('custom-modal').classList.add('hidden'); 
}

function selectColor(type, colorName, element) {
    customSelections[type] = colorName;
    const siblings = element.parentElement.querySelectorAll('.color-circle');
    siblings.forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function addCustomBracelet() {
    const cristales = Array.from(document.querySelectorAll('input[name="cristal"]:checked')).map(cb => cb.value);
    
    if (cristales.length === 0) return alert("Por favor, selecciona al menos un color de cristal.");
    if (!customSelections.base || !customSelections.sec) return alert("Por favor, selecciona los 2 colores de la pulsera.");

    const customSKU = `Personalizada - Cristales: ${cristales.join(', ')} | Colores: ${customSelections.base} y ${customSelections.sec}`;
    
    const customProduct = {
        sku: "Diseño Propio",
        description: customSKU,
        price: 250, // PRECIO ACTUALIZADO
        image: "https://i.postimg.cc/Z5T3mcHk/Bio.png", 
        cantidad: 1
    };

    cart.push(customProduct);
    updateCartUI();
    closeCustomizer();
    
    // Limpiar formulario
    document.querySelectorAll('input[name="cristal"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.color-circle').forEach(el => el.classList.remove('selected'));
    customSelections = { base: '', sec: '' };
    
    alert("¡Tu diseño único se ha añadido al carrito por $250.00 MXN! ✨");
}

loadProducts();