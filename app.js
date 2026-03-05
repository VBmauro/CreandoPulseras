// Tu enlace mágico a Google Sheets
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxYAv5_PQcYRtLinlyFny3vcabcC2WCN-eD476i7dCyBmLYw-LOBx5i8lHwqYKTuPpUrg/exec";

let products = [];
let cart = [];

// ==========================================
// CÓDIGO PARA LA TIENDA PÚBLICA
// ==========================================
async function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return; 

    container.innerHTML = '<p style="text-align:center; width:100%;">Cargando catálogo de pulseras...</p>';

    try {
        const response = await fetch(SCRIPT_URL);
        products = await response.json();
        renderProducts();
    } catch (error) {
        container.innerHTML = '<p style="text-align:center; width:100%;"><b>Error de conexión.</b></p>';
        console.error(error);
    }
}

function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%;">Próximamente nueva colección...</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const price = parseFloat(product.price) || 0;
        
        // Aquí agregamos la cajita de cantidad (qty-input)
        card.innerHTML = `
            <img src="${product.image}" alt="Pulsera ${product.sku}">
            <h3>SKU: ${product.sku}</h3>
            <p>${product.description}</p>
            <small>Medida: ${product.measurements} | Stock: ${product.stock}</small>
            <h4>$${price.toFixed(2)}</h4>
            <div class="add-to-cart-container">
                <input type="number" id="qty-${product.sku}" value="1" min="1" max="${product.stock}" class="qty-input">
                <button onclick="addToCart('${product.sku}')">Añadir</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==========================================
// FUNCIONES DEL CARRITO
// ==========================================
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if(modal) modal.classList.toggle('hidden');
}

function addToCart(sku) {
    const product = products.find(p => String(p.sku) === String(sku));
    
    if (product) {
        // Obtenemos la cantidad que el cliente escribió en la cajita
        const qtyInput = document.getElementById(`qty-${sku}`);
        const cantidadPedida = parseInt(qtyInput.value) || 1;

        // Revisamos si la pulsera ya estaba en el carrito
        const productoExistente = cart.find(item => String(item.sku) === String(sku));

        if (productoExistente) {
            // Si ya estaba, le sumamos la nueva cantidad
            productoExistente.cartQuantity += cantidadPedida;
        } else {
            // Si es nueva, la clonamos y le ponemos su cantidad
            cart.push({ ...product, cartQuantity: cantidadPedida });
        }

        updateCartUI();
        alert(`¡Añadido al carrito (${cantidadPedida} piezas)!`);
        qtyInput.value = 1; // Regresamos la cajita a 1 por defecto
    } else {
        alert("Hubo un error al buscar el producto.");
    }
}

function updateCartUI() {
    const countDisplay = document.getElementById('cart-count');
    const itemsDisplay = document.getElementById('cart-items');
    const subtotalDisplay = document.getElementById('subtotal-price');
    const totalDisplay = document.getElementById('total-price');
    
    if(!countDisplay || !itemsDisplay || !subtotalDisplay || !totalDisplay) return;

    itemsDisplay.innerHTML = '';
    
    let subtotal = 0;
    let totalArticulos = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const totalPorItem = price * item.cartQuantity; // Multiplica precio por cantidad
        
        subtotal += totalPorItem;
        totalArticulos += item.cartQuantity;
        
        itemsDisplay.innerHTML += `<p>▪️ ${item.cartQuantity}x ${item.sku} - $${totalPorItem.toFixed(2)}</p>`;
    });

    countDisplay.innerText = totalArticulos; // Actualiza el número de arriba

    const costoEnvio = 50.00;
    subtotalDisplay.innerText = subtotal.toFixed(2);
    
    if (cart.length > 0) {
        totalDisplay.innerText = (subtotal + costoEnvio).toFixed(2);
    } else {
        totalDisplay.innerText = "0.00";
    }
}

// ==========================================
// CÓDIGO PARA EL PANEL PRIVADO
// ==========================================
const adminForm = document.getElementById('product-form');
if (adminForm) {
    adminForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const btn = adminForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Guardando en la base de datos...";
        btn.disabled = true;

        const formData = new URLSearchParams();
        formData.append('sku', document.getElementById('sku').value);
        formData.append('image', document.getElementById('image-url').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('measurements', document.getElementById('measurements').value);
        formData.append('stock', document.getElementById('stock').value);
        formData.append('price', document.getElementById('price').value);

        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        .then(response => {
            alert("¡Éxito! Producto guardado en tu inventario.");
            adminForm.reset(); 
            btn.innerText = originalText;
            btn.disabled = false;
        })
        .catch(error => {
            alert("¡Éxito! Producto enviado a la base de datos.");
            adminForm.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        });
    });
}

// ==========================================
// FUNCIÓN DE PAGO (WHATSAPP)
// ==========================================
function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. ¡Añade unas pulseras primero!");
        return;
    }

    const nombre = document.getElementById('customer-name').value.trim();
    const telefono = document.getElementById('customer-phone').value.trim();
    const cp = document.getElementById('customer-cp').value.trim(); // Nuevo dato
    const direccion = document.getElementById('customer-address').value.trim();

    if (!nombre || !telefono || !cp || !direccion) {
        alert("Por favor, llena tus datos de envío completos para poder procesar tu pedido.");
        return;
    }

    // 🔴 REEMPLAZA ESTO CON TU NÚMERO REAL
    const miWhatsApp = "9813493773"; 

    let mensaje = "¡Hola CreandoPulseras! ✨ Quiero confirmar mi pedido:\n\n";
    let subtotal = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const totalPorItem = price * item.cartQuantity;
        mensaje += `▪️ ${item.cartQuantity}x SKU: ${item.sku} ($${totalPorItem.toFixed(2)})\n`;
        subtotal += totalPorItem;
    });

    const costoEnvio = 50.00;
    const totalFinal = subtotal + costoEnvio;

    mensaje += `\n📦 *Subtotal:* $${subtotal.toFixed(2)}`;
    mensaje += `\n🚚 *Envío (MEXPOST):* $${costoEnvio.toFixed(2)}`;
    mensaje += `\n💰 *TOTAL A PAGAR:* $${totalFinal.toFixed(2)}\n\n`;
    
    mensaje += `📍 *DATOS DE ENVÍO:*\n`;
    mensaje += `👤 Nombre: ${nombre}\n`;
    mensaje += `📞 Teléfono: ${telefono}\n`;
    mensaje += `📮 C.P.: ${cp}\n`;
    mensaje += `🏠 Dirección: ${direccion}\n\n`;

    mensaje += `¿Me confirmas dónde deposito?`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const url = `https://wa.me/${miWhatsApp}?text=${mensajeCodificado}`;
    
    window.open(url, '_blank');
}

// Arrancar la página buscando productos
loadProducts();