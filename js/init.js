const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
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
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", function () {
// Verificar sesión en todas las páginas excepto login.html
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