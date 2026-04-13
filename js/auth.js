/* ======================================================================================================================
   FUNCIONALIDAD 1 - INICIO DE SESIÓN con la funcion manejarLogin()
   FUNCIONALIDAD 2 - REGISTRO con la funcionmanejarRegistro()

   Este archivo solo se encarga de formularios de login y registro.
   Los datos (listaUsuarios, etc.) vienen de datos.js, que ya cargó el HTML.
   ====================================================================================================================== */

/**
 * Muestra un mensaje bajo el formulario. esError = true pinta estilo de error
 * Usamos classList (capa CSS), no estilos inline.
 */
function mostrarMensajeAutenticacion(elementoMensaje, texto, esError) {
  if (!elementoMensaje) {
    return;
  }
  elementoMensaje.textContent = texto;
  elementoMensaje.hidden = texto === "";
  elementoMensaje.classList.remove("mensaje-error", "mensaje-exito");
  if (texto === "") {
    return;
  }
  if (esError) {
    elementoMensaje.classList.add("mensaje-error");
  } else {
    elementoMensaje.classList.add("mensaje-exito");
  }
}

/**
 * Se ejecuta cuando el usuario envía el formulario de login
 * evento.preventDefault() evita que la página se recargue como envío real por asi decirlo.
 */
function manejarLogin(evento) {
  evento.preventDefault();
  const formulario = evento.target;
  const correo = formulario.elements.correo.value.trim();
  const contrasena = formulario.elements.contrasena.value;
  const elementoMensaje = document.getElementById("mensajeAuth");

  if (correo === "" || contrasena === "") {
    mostrarMensajeAutenticacion(
      elementoMensaje,
      "Ingresa correo y contraseña.",
      true,
    );
    return;
  }

  // Buscamos en listaUsuarios un correo y clave que coincidan 
  let usuarioEncontrado = null;
  for (let i = 0; i < listaUsuarios.length; i++) {
    const usuario = listaUsuarios[i];
    const mismoCorreo =
      usuario.correo.toLowerCase() === correo.toLowerCase();
    const mismaClave = usuario.contrasena === contrasena;
    if (mismoCorreo && mismaClave) {
      usuarioEncontrado = usuario;
      break;
    }
  }

  if (usuarioEncontrado === null) {
    mostrarMensajeAutenticacion(
      elementoMensaje,
      "Credenciales incorrectas o usuario no registrado.",
      true,
    );
    return;
  }

  // Guardamos solo lo necesario para el resto de pantallas, esto va sin contraseña.
  usuarioActivo = {
    idUsuario: usuarioEncontrado.idUsuario,
    nombreUsuario: usuarioEncontrado.nombreUsuario,
    correo: usuarioEncontrado.correo,
    nombreCompleto: usuarioEncontrado.nombreCompleto,
  };
  guardarEstadoEnSesionVentana();
  mostrarMensajeAutenticacion(
    elementoMensaje,
    "Acceso correcto. Redirigiendo…",
    false,
  );
  window.setTimeout(function () {
    window.location.href = "feed.html";
  }, 400);
}

/**
 * Esto es super interesante porque nos ahorra tiempo
 * aqui lo que hacemos es crear un id único simple usando
 * la hora actual en milisegundos, así evitamos bucles complicados 
 * para generar un id nuevo cada vez que se registra un usuario.
 */
function generarIdUsuarioNuevo() {
  return "usr-" + String(Date.now());
}

/**
 * Aquí va el registro, valida campos, agrega el usuario al arreglo y deja la sesión iniciada.
 */
function manejarRegistro(evento) {
  evento.preventDefault();
  const formulario = evento.target;
  const nombreCompleto = formulario.elements.nombreCompleto.value.trim();
  const nombreUsuario = formulario.elements.nombreUsuario.value.trim();
  const correo = formulario.elements.correo.value.trim();
  const contrasena = formulario.elements.contrasena.value;
  const contrasenaConfirmacion =
    formulario.elements.contrasenaConfirmacion.value;
  const elementoMensaje = document.getElementById("mensajeAuth");
/**
 * Validamos que no falte ningún campo, que las contraseñas coincidan, 
 * que tengan al menos 6 caracteres y que el correo o nombre de usuario no estén repetidos.
 */
  if (
    nombreCompleto === "" ||
    nombreUsuario === "" ||
    correo === "" ||
    contrasena === "" ||
    contrasenaConfirmacion === ""
  ) {
    mostrarMensajeAutenticacion(
      elementoMensaje,
      "Completa todos los campos.",
      true,
    );
    return;
  }

  if (contrasena !== contrasenaConfirmacion) {
    mostrarMensajeAutenticacion(
      elementoMensaje,
      "Las contraseñas no coinciden.",
      true,
    );
    return;
  }

  if (contrasena.length < 6) {
    mostrarMensajeAutenticacion(
      elementoMensaje,
      "La contraseña debe tener al menos 6 caracteres.",
      true,
    );
    return;
  }

  // Evitamos dos usuarios con el mismo correo o mismo nombre de usuario.
  for (let i = 0; i < listaUsuarios.length; i++) {
    const usuario = listaUsuarios[i];
    if (usuario.correo.toLowerCase() === correo.toLowerCase()) {
      mostrarMensajeAutenticacion(
        elementoMensaje,
        "Ese correo ya está en uso.",
        true,
      );
      return;
    }
    if (usuario.nombreUsuario.toLowerCase() === nombreUsuario.toLowerCase()) {
      mostrarMensajeAutenticacion(
        elementoMensaje,
        "Ese nombre de usuario ya está en uso.",
        true,
      );
      return;
    }
  }

  const nuevoUsuario = {
    idUsuario: generarIdUsuarioNuevo(),
    nombreUsuario: nombreUsuario,
    correo: correo,
    contrasena: contrasena,
    nombreCompleto: nombreCompleto,
  };
  listaUsuarios.push(nuevoUsuario);

  usuarioActivo = {
    idUsuario: nuevoUsuario.idUsuario,
    nombreUsuario: nuevoUsuario.nombreUsuario,
    correo: nuevoUsuario.correo,
    nombreCompleto: nuevoUsuario.nombreCompleto,
  };
  guardarEstadoEnSesionVentana();
  mostrarMensajeAutenticacion(
    elementoMensaje,
    "Cuenta creada. Entrando al foro…",
    false,
  );
  window.setTimeout(function () {
    window.location.href = "feed.html";
  }, 400);
}

/** Conecta el formulario de index.html. */
function inicializarPaginaLogin() {
  const formularioLogin = document.getElementById("formularioLogin");
  if (formularioLogin) {
    formularioLogin.addEventListener("submit", manejarLogin);
  }
}

/** Conecta el formulario de register.html. */
function inicializarPaginaRegistro() {
  const formularioRegistro = document.getElementById("formularioRegistro");
  if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", manejarRegistro);
  }
}

// Cuando el HTML terminó de cargar, enganchamos los formularios.
document.addEventListener("DOMContentLoaded", function () {
  inicializarPaginaLogin();
  inicializarPaginaRegistro();
});
