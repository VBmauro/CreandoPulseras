# ✨ CreandoPulseras - E-commerce Oficial

Tienda en línea oficial de **CreandoPulseras**, especializada en joyería artesanal elaborada con materiales de la más alta calidad (perla cultivada, acero dorado, piedras naturales y cristales). El sitio está diseñado para ofrecer una experiencia de compra fluida, elegante y directa.

🌍 **Sitio Web en Vivo:** [Visitar Tienda](https://vbmauro.github.io/CreandoPulseras/)
📍 **Ubicación:** San Francisco de Campeche, Campeche, México.

---

## 🚀 Características Principales

* **Catálogo Dinámico:** Los productos se cargan automáticamente desde una base de datos en Google Sheets.
* **Carrito de Compras Flotante:** Un carrito interactivo que sigue al usuario por la página, calculando subtotales y opciones de envío.
* **Checkout por WhatsApp:** La pasarela de pago redirige al cliente directamente al WhatsApp del vendedor con un resumen detallado del pedido y los datos de envío.
* **Control de Inventario (Stock):** El sistema resta automáticamente el stock de la base de datos de Google Sheets al momento de generar una orden.
* **Zoom de Alta Calidad:** Sistema de doble zoom para apreciar los detalles de las joyas (efecto hover en tarjetas y Lightbox a pantalla completa).
* **Contador de Visitas:** Registro de visitas en tiempo real almacenado y consultado desde Google Sheets.
* **Diseño UI/UX Personalizado:** * Fondo de texturas ultra realistas (seamless tile).
  * Recuadros de productos con paleta de colores pastel aleatoria.
  * Código QR integrado para fácil acceso y distribución móvil.
* **Panel de Administración (`admin.html`):** Una interfaz privada para agregar nuevos productos (SKU, imagen, medidas, stock, precio) directamente a la base de datos sin tocar código.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto es de tipo *Serverless* y utiliza tecnologías web estándar, apoyándose en el ecosistema de Google para el backend:

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+).
* **Backend & Base de Datos:** Google Apps Script / Google Sheets.
* **Hosting:** GitHub Pages.
* **Integraciones:** API de WhatsApp (`wa.me`), API de generación de códigos QR (`qrserver.com`).

---

## 📁 Estructura del Proyecto

```text
/
├── index.html      # Estructura principal de la tienda (Catálogo, Carrito, Modales).
├── admin.html      # Panel de control privado para subir nuevos productos.
├── styles.css      # Hoja de estilos (Diseño responsivo, animaciones, fondos).
├── app.js          # Lógica principal (Fetch API, renderizado, carrito, checkout).
└── README.md       # Documentación del proyecto.
