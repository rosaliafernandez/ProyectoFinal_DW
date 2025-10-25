document.addEventListener("DOMContentLoaded", () => {
  if (typeof verificarSesion === "function") {
    verificarSesion();
  }

  const emailInput = document.getElementById("email");
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const telefonoInput = document.getElementById("telefono");
  const imagenInput = document.getElementById("imagenPerfil");
  const previewImagen = document.getElementById("previewImagen");
  const form = document.getElementById("profileForm");
  const mensajeGuardado = document.getElementById("mensajeGuardado");

  let usuarioLogueado = null;
  if (typeof obtenerUsuarioLogueado === "function") {
    const datosUsuario = obtenerUsuarioLogueado();
    if (datosUsuario && datosUsuario.usuario) {
      usuarioLogueado = datosUsuario.usuario;
    }
  } else {
    usuarioLogueado = localStorage.getItem("usuarioLogueado");
  }

  const datosGuardados = JSON.parse(localStorage.getItem("datosPerfil"));
  if (datosGuardados) {
    nombreInput.value = datosGuardados.nombre || "";
    apellidoInput.value = datosGuardados.apellido || "";
    emailInput.value = datosGuardados.email || usuarioLogueado || "";
    telefonoInput.value = datosGuardados.telefono || "";
  } else if (usuarioLogueado && emailInput.value.trim() === "") {
    // Si no hay datos guardados, precargar el email del usuario logueado
    emailInput.value = usuarioLogueado;
  }

  // DESAFÍO: Persistencia de la imagen de perfil
  // Guardar imagen en localStorage
imagenInput.addEventListener("change", () => {
  const file = imagenInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      // Guardar en localStorage
      localStorage.setItem("profileImage", base64Image);
      // Mostrar vista previa
      const icon = previewImagen.querySelector("i");
      if (icon) icon.style.display = "none";
      previewImagen.style.backgroundImage = `url(${base64Image})`;
    };
    reader.readAsDataURL(file);
  }
});

  //Guardar datos localmente
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const datosPerfil = {
      nombre: nombreInput.value.trim(),
      apellido: apellidoInput.value.trim(),
      email: emailInput.value.trim(),
      telefono: telefonoInput.value.trim()
    };
    localStorage.setItem("datosPerfil", JSON.stringify(datosPerfil));

    mensajeGuardado.style.display = "block";
    setTimeout(() => mensajeGuardado.style.display = "none", 2000);
  });

  // Cargar imagen guardada
const savedImage = localStorage.getItem("profileImage");
if (savedImage) {
  const icon = previewImagen.querySelector("i");
  if (icon) icon.style.display = "none";
  previewImagen.style.backgroundImage = `url(${savedImage})`;
}
  
  if (typeof mostrarUsuarioEnNavbar === "function") {
    mostrarUsuarioEnNavbar();
  }
});
