document.addEventListener("DOMContentLoaded", function() {
    // Verificar si ya hay una sesión activa
    const sesionActiva = localStorage.getItem('sesionActiva');
    if (sesionActiva === 'true') {
        // Si ya está logueado, redirigir al index
        window.location.href = "index.html";
        return;
    }
    
    // Agarrar los elementos del HTML
    const loginForm = document.getElementById("loginForm");
    const usuarioInput = document.getElementById("usuario");
    const contrasenaInput = document.getElementById("contrasena");
    const mensajeError = document.getElementById("mensajeError");

    // Escuchar el submit del formulario
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault(); // Evitar que el form se envíe automáticamente

        const usuario = usuarioInput.value.trim();
        const contrasena = contrasenaInput.value.trim();

        // Validar que no estén vacíos
        if (!usuario || !contrasena) {
            mensajeError.textContent = "Debe completar ambos campos.";
            mensajeError.style.display = "block";
            return;
        }

        try {
            // Hacer fetch al backend
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, contrasena })
            });

            const data = await response.json();

            if (data.success) {
                // Ocultar mensaje de error
                mensajeError.style.display = "none";
                
                // Guardar token y datos del usuario
                localStorage.setItem('token', data.token);
                localStorage.setItem('sesionActiva', 'true');
                localStorage.setItem('usuarioLogueado', data.usuario);
                localStorage.setItem('fechaLogin', new Date().toISOString());
                
                // Redirigir a la página principal
                window.location.href = "index.html";
            } else {
                // Mostrar error del servidor
                mensajeError.textContent = data.message;
                mensajeError.style.display = "block";
            }
        } catch (error) {
            console.error('Error:', error);
            mensajeError.textContent = "Error al conectar con el servidor. ¿Está corriendo el backend?";
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