document.addEventListener("DOMContentLoaded", function() {
    
    // Agarrar los elementos del HTML
    const loginForm = document.getElementById("loginForm");
    const usuarioInput = document.getElementById("usuario");
    const contrasenaInput = document.getElementById("contrasena");
    const mensajeError = document.getElementById("mensajeError");

    // Escuchar el submit del formulario
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
    });

    contrasenaInput.addEventListener("input", function() {
        if (mensajeError.style.display === "block") {
            mensajeError.style.display = "none";
        }
    });
});