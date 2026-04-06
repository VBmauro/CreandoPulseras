const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxihChz7LBFhsbTyvdCoInpkdLnAmtFj3NMxJ6GzkVaHR6Chgz5yjmTgcGfd5amD-6wJQ/exec";

let products = [];
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
        `;
        container.appendChild(card);
    });
}

function openZoom(src) { document.getElementById('zoomed-img').src = src; document.getElementById('zoom-modal').classList.remove('hidden'); }
function closeZoom() { document.getElementById('zoom-modal').classList.add('hidden'); }
function openContact() { document.getElementById('contact-modal').classList.remove('hidden'); }
function closeContact() { document.getElementById('contact-modal').classList.add('hidden'); }

loadProducts();