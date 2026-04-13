/* ======================================================================================================================
   FUNCIONALIDAD 4 - CREAR PUBLICACIÓN EN EL FORO con la funcion manejarEnvioPost()

   Agrega un objeto nuevo a listaPublicaciones y guarda el estado en window.name
   IMPORTANTE ACÁ, el estado se guardamediante guardarEstadoEnSesionVentana, definido en datos.js
   ====================================================================================================================== */

/**
 * Id simple para una publicación nueva (timestamp).
 */
function generarIdPublicacionNueva() {
  return "pub-" + String(Date.now());
}

function mostrarMensajeFormulario(elemento, texto, esError) {
  if (!elemento) {
    return;
  }
  elemento.textContent = texto;
  elemento.hidden = texto === "";
  elemento.classList.remove("mensaje-error", "mensaje-exito");
  if (texto === "") {
    return;
  }
  if (esError) {
    elemento.classList.add("mensaje-error");
  } else {
    elemento.classList.add("mensaje-exito");
  }
}

/**
 * Valida el formulario, crea la publicación y vuelve al feed.
 */
function manejarEnvioPost(evento) {
  evento.preventDefault();

  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  const formulario = evento.target;
  const titulo = formulario.elements.titulo.value.trim();
  const categoria = formulario.elements.categoria.value;
  const contenido = formulario.elements.contenido.value.trim();
  const elementoMensaje = document.getElementById("mensajeFormularioPost");

  if (titulo === "" || categoria === "" || contenido === "") {
    mostrarMensajeFormulario(
      elementoMensaje,
      "Completa título, categoría y descripción.",
      true,
    );
    return;
  }

  if (titulo.length > LONGITUD_MAXIMA_TITULO) {
    mostrarMensajeFormulario(
      elementoMensaje,
      "El título no puede superar " + LONGITUD_MAXIMA_TITULO + " caracteres.",
      true,
    );
    return;
  }

  let categoriaValida = false;
  for (let i = 0; i < CATEGORIAS_DISPONIBLES.length; i++) {
    if (CATEGORIAS_DISPONIBLES[i] === categoria) {
      categoriaValida = true;
      break;
    }
  }
  if (!categoriaValida) {
    mostrarMensajeFormulario(elementoMensaje, "Categoría no válida.", true);
    return;
  }

  const nuevaPublicacion = {
    idPublicacion: generarIdPublicacionNueva(),
    titulo: titulo,
    contenido: contenido,
    categoria: categoria,
    idAutor: usuarioActivo.idUsuario,
    nombreAutor: usuarioActivo.nombreCompleto,
    fechaIso: new Date().toISOString(),
    idsUsuariosQueDieronLike: [],
  };

  listaPublicaciones.push(nuevaPublicacion);
  guardarEstadoEnSesionVentana();
  mostrarMensajeFormulario(
    elementoMensaje,
    "Publicación creada. Redirigiendo al foro…",
    false,
  );
  window.setTimeout(function () {
    window.location.href = "feed.html";
  }, 450);
}

function inicializarFormularioPost() {
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  const saludoUsuario = document.getElementById("saludoUsuario");
  if (saludoUsuario) {
    saludoUsuario.textContent = usuarioActivo.nombreCompleto;
  }

  const formulario = document.getElementById("formularioCrearPost");
  if (formulario) {
    formulario.addEventListener("submit", manejarEnvioPost);
    const inputTitulo = formulario.elements.titulo;
    if (inputTitulo) {
      inputTitulo.setAttribute("maxlength", String(LONGITUD_MAXIMA_TITULO));
    }
  }

  const enlaceCerrarSesion = document.getElementById("enlaceCerrarSesion");
  if (enlaceCerrarSesion) {
    enlaceCerrarSesion.addEventListener("click", function (evento) {
      evento.preventDefault();
      usuarioActivo = null;
      guardarEstadoEnSesionVentana();
      window.location.href = "index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", inicializarFormularioPost);
