const CATEGORIES_URL = "http://localhost:3000/cats/cat.json";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/sell/publish.json";
const PRODUCTS_URL = "http://localhost:3000/cats_products/";
const PRODUCT_INFO_URL = "http://localhost:3000/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/products_comments/";
const CART_INFO_URL = "http://localhost:3000/user_cart/";
const CART_BUY_URL = "http://localhost:3000/cart/buy.json";
const EXT_TYPE = ".json";

// Función para mostrar spinner
function showSpinner() {
const spinner = document.getElementById("spinner-wrapper");
if (spinner) spinner.style.display = "block";
}

// Función para ocultar spinner
function hideSpinner() {
const spinner = document.getElementById("spinner-wrapper");
if (spinner) spinner.style.display = "none";
}

// Función para hacer peticiones a la API
function getJSONData(url) {
  let result = {};
  showSpinner();
  return fetch(url)
.then(response => {
if (response.ok) {
return response.json();
      } else {
throw Error(response.statusText);
      }
    })
.then(function (response) {
result.status = 'ok';
result.data = response;
      hideSpinner();
      return result;
    })
.catch(function (error) {
result.status = 'error';
result.data = error;
      hideSpinner();
      return result;
    });
}

// --- FUNCIONES DE AUTENTICACIÓN (fuera de getJSONData) ---

// Verifica si hay sesión activa
function verificarSesion() {
const sesionActiva = localStorage.getItem('sesionActiva');
if (sesionActiva !== 'true' && !window.location.pathname.includes('login.html')) {
window.location.href = "login.html";
    return false;
  }
  return true;
}

// Cierra la sesión
function cerrarSesion() {
localStorage.removeItem('sesionActiva');
localStorage.removeItem('usuarioLogueado');
localStorage.removeItem('fechaLogin');
window.location.href = "login.html";
}

// Obtiene datos del usuario
function obtenerUsuarioLogueado() {
if (localStorage.getItem('sesionActiva') === 'true') {
    return {
usuario: localStorage.getItem('usuarioLogueado'),
fechaLogin: localStorage.getItem('fechaLogin')
    };
  }
  return null;
}

// Muestra el nombre del usuario en el navbar
function mostrarUsuarioEnNavbar() {
  const datosUsuario = obtenerUsuarioLogueado();
  if (datosUsuario) {
const usuarioNombre = document.getElementById("usuarioNombre");
    if (usuarioNombre) {
usuarioNombre.textContent = datosUsuario.usuario;
    }

    //inserta dinámicamente el menú desplegable si no existe o está incompleto
    const usuarioMenu = document.getElementById("usuarioMenu");
    if (usuarioMenu) {
      const dropdown = usuarioMenu.nextElementSibling;
      if (dropdown && !dropdown.querySelector('a[href="my-profile.html"]')) {
        const miPerfil = document.createElement("li");
        miPerfil.innerHTML = '<a class="dropdown-item" href="my-profile.html">Mi perfil</a>';
        dropdown.insertBefore(miPerfil, dropdown.firstChild);
      }
    }
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", function () {
if (!window.location.pathname.includes('login.html')) {
    verificarSesion();
    mostrarUsuarioEnNavbar();
  }

// Configurar botón de cerrar sesión
const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
logoutBtn.addEventListener("click", function (e) {
e.preventDefault();
      cerrarSesion();
    });
  }
});

const toggle = document.getElementById("darkModeToggle");

toggle.addEventListener("change", function() {
  if (this.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("modoOscuro", "true");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("modoOscuro", "false");
  }
});

// Al cargar la página leer la preferencia
if (localStorage.getItem("modoOscuro") === "true") {
  toggle.checked = true;
  document.body.classList.add("dark-mode");
}

function actualizarBadgeCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    const badge = document.getElementById("cartBadge");
    if (!badge) return;

    badge.textContent = total;
    badge.style.display = total > 0 ? "inline-block" : "none";
}

document.addEventListener("DOMContentLoaded", actualizarBadgeCarrito);
