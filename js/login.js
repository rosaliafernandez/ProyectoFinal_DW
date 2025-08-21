document.addEventListener("DOMContentLoaded", function() {
    
    // Agarrar los elementos del HTML
    const loginForm = document.getElementById("loginForm");
    const usuarioInput = document.getElementById("usuario");
    const contrasenaInput = document.getElementById("contrasena");
    const mensajeError = document.getElementById("mensajeError");

    const sesionActiva = localStorage.getItem('sesionActiva');
if (sesionActiva === 'true') {
    // Si ya está logueado, redirigir al index
    window.location.href = "index.html";
    return;
}
   

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Evitar que el form se envíe automáticamente

        // Validar ambos campos
        const validarUsuario = usuarioInput.value.trim() !== "";
        const validarContrasena = contrasenaInput.value.trim() !== "";

        // Si ambos campos están llenos, redirigir a index.html
        if (validarUsuario && validarContrasena) {
            // Ocultar mensaje de error por si estaba visible
            mensajeError.style.display = "none";
            
            // Redirigir a la página principal
            window.location.href = "index.html";
        } else {
            // Mostrar mensaje de error
            mensajeError.style.display = "block";
        }
    });

    // Ocultar el mensaje de error cuando el usuario empiece a escribir
    usuarioInput.addEventListener("input", function() {
        if (mensajeError.style.display === "block") {
            mensajeError.style.display = "none";
        }
        
        localStorage.setItem('sesionActiva', 'true');
localStorage.setItem('usuarioLogueado', usuarioInput.value.trim());
localStorage.setItem('fechaLogin', new Date().toISOString());
    });

    contrasenaInput.addEventListener("input", function() {
        if (mensajeError.style.display === "block") {
            mensajeError.style.display = "none";
        }
    });

    document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("usuario") && !window.location.href.includes("login.html")) {
        alert("No has iniciado sesión. Serás redirigido al login.");
        window.location.href = "login.html";
    }
});
});