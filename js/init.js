const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });


// Funciones de autenticación
function verificarSesion() {
    const sesionActiva = localStorage.getItem('sesionActiva');
    
    // Si no hay sesión activa, redirigir al login
    if (sesionActiva !== 'true') {
        window.location.href = "login.html";
        return false;
    }
    
    return true;
}

function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('fechaLogin');
    window.location.href = "login.html";
}

function obtenerUsuarioLogueado() {
    if (localStorage.getItem('sesionActiva') === 'true') {
        return {
            usuario: localStorage.getItem('usuarioLogueado'),
            fechaLogin: localStorage.getItem('fechaLogin')
        };
    }
    return null;
}

function mostrarUsuarioEnNavbar() {
    const datosUsuario = obtenerUsuarioLogueado();
    if (datosUsuario) {
       
        const navbarUser = document.querySelector('.navbar-user');
        if (navbarUser) {
            navbarUser.textContent = `Hola, ${datosUsuario.usuario}`;
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {

    if (!window.location.pathname.includes('login.html')) {
        verificarSesion();
        mostrarUsuarioEnNavbar();
    }
});
}