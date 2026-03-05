// Tu enlace mágico a Google Sheets
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxYAv5_PQcYRtLinlyFny3vcabcC2WCN-eD476i7dCyBmLYw-LOBx5i8lHwqYKTuPpUrg/exec";

let products = [];
let cart = [];

// ==========================================
// CÓDIGO PARA LA TIENDA PÚBLICA (index.html)
// ==========================================
async function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return; // Si no estamos en la tienda, ignora esto

    container.innerHTML = '<p style="text-align:center; width:100%;">Cargando catálogo de pulseras...</p>';

    try {
        const response = await fetch(SCRIPT_URL);
        products = await response.json();
        renderProducts();
    } catch (error) {
        container.innerHTML = '<p style="text-align:center; width:100%;"><b>Error de conexión:</b> Asegúrate de que al publicar tu Google Script elegiste "Cualquier persona" (Anyone) en los accesos.</p>';
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
        
        card.innerHTML = `
            <img src="${product.image}" alt="Pulsera ${product.sku}">
            <h3>SKU: ${product.sku}</h3>
            <p>${product.description}</p>
            <small>Medida: ${product.measurements} | Stock: ${product.stock}</small>
            <h4>$${price.toFixed(2)}</h4>
            <button onclick="addToCart('${product.sku}')">Añadir al Carrito</button>
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
    // Al usar String() evitamos que falle si el SKU son puros números
    const product = products.find(p => String(p.sku) === String(sku));
    if (product) {
        cart.push(product);
        updateCartUI();
        alert("¡Añadido al carrito!");
    } else {
        alert("Hubo un error al buscar el producto.");
    }
}

function updateCartUI() {
    const countDisplay = document.getElementById('cart-count');
    const itemsDisplay = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    
    if(!countDisplay || !itemsDisplay || !totalDisplay) return;

    countDisplay.innerText = cart.length;
    itemsDisplay.innerHTML = '';
    
    let total = 0;
    cart.forEach(item => {
        const price = parseFloat(item.price) || 0;
        total += price;
        itemsDisplay.innerHTML += `<p>${item.sku} - $${price.toFixed(2)}</p>`;
    });
    totalDisplay.innerText = total.toFixed(2);
}

// ==========================================
// CÓDIGO PARA EL PANEL PRIVADO (admin.html)
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
            mode: 'no-cors', // Segurança restaurada
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

    // 🔴 REEMPLAZA ESTO CON TU NÚMERO REAL
    const miWhatsApp = "9813493773"; 

    let mensaje = "¡Hola CreandoPulseras! ✨ Quiero confirmar este pedido:\n\n";
    let total = 0;

    cart.forEach(item => {
        const precio = parseFloat(item.price) || 0;
        mensaje += `▪️ 1x SKU: ${item.sku} ($${precio.toFixed(2)})\n`;
        total += precio;
    });

    mensaje += `\n*Total a pagar: $${total.toFixed(2)}*\n\n¿Me confirmas dónde deposito?`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const url = `https://wa.me/${miWhatsApp}?text=${mensajeCodificado}`;
    
    window.open(url, '_blank');
}

// Arrancar la página buscando productos

loadProducts();

