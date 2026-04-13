/* ======================================================================================================================
   FUNCIONALIDAD 3 - EXPLORAR EL FORO que se da en las funciones renderizarFeed(), filtrarPorBusqueda(), filtrarCategoria()

   FUNCIONALIDAD 5 - DAR LIKE con funcion manejarClickLike()
   El click en me gusta se escucha en el contenedor (delegación de eventos):
   un solo listener para muchas tarjetas.
   ====================================================================================================================== */

/** Texto que escribió el usuario en el buscador (se actualiza al tipear). */
let textoBusquedaActual = "";

/** Valor del select de categoría; "todas" significa sin filtrar. */
let categoriaSeleccionada = "todas";

/**
 * Pasa una fecha en formato ISO a texto corto legible (ej. 12 abr 2026).
 */
function formatearFechaLegible(fechaIso) {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) {
    return "";
  }
  return fecha.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Devuelve el nombre amigable de la categoría para mostrar en la tarjeta.
 */
function etiquetaCategoria(categoria) {
  if (categoria === "convocatoria") {
    return "Convocatoria";
  }
  if (categoria === "evento") {
    return "Evento";
  }
  if (categoria === "alertaAcademica") {
    return "Alerta académica";
  }
  if (categoria === "bienestar") {
    return "Bienestar";
  }
  if (categoria === "tecnologia") {
    return "Tecnología";
  }
  if (categoria === "deportes") {
    return "Deportes";
  }
  if (categoria === "cultura") {
    return "Cultura";
  }
  if (categoria === "general") {
    return "General";
  }
  return categoria;
}

/**
 * Arma un arreglo nuevo con las publicaciones que pasan búsqueda y categoría,
 * y las ordena con la más reciente primero.
 */
function obtenerPublicacionesFiltradas() {
  let resultado = [];
  for (let i = 0; i < listaPublicaciones.length; i++) {
    resultado.push(listaPublicaciones[i]);
  }

  if (categoriaSeleccionada !== "todas") {
    const filtradas = [];
    for (let j = 0; j < resultado.length; j++) {
      if (resultado[j].categoria === categoriaSeleccionada) {
        filtradas.push(resultado[j]);
      }
    }
    resultado = filtradas;
  }

  const termino = textoBusquedaActual.trim().toLowerCase();
  if (termino !== "") {
    const filtradas = [];
    for (let k = 0; k < resultado.length; k++) {
      const publicacion = resultado[k];
      const titulo = publicacion.titulo.toLowerCase();
      const contenido = publicacion.contenido.toLowerCase();
      const autor = publicacion.nombreAutor.toLowerCase();
      const coincide =
        titulo.indexOf(termino) !== -1 ||
        contenido.indexOf(termino) !== -1 ||
        autor.indexOf(termino) !== -1;
      if (coincide) {
        filtradas.push(publicacion);
      }
    }
    resultado = filtradas;
  }

  resultado.sort(function (a, b) {
    const ta = new Date(a.fechaIso).getTime();
    const tb = new Date(b.fechaIso).getTime();
    return tb - ta;
  });

  return resultado;
}

/**
 * Vacía el contenedor y vuelve a crear las tarjetas en el DOM.
 */
function renderizarFeed() {
  const contenedor = document.getElementById("contenedorFeed");
  const textoVacio = document.getElementById("textoFeedVacio");
  if (!contenedor) {
    return;
  }

  const publicaciones = obtenerPublicacionesFiltradas();
  contenedor.replaceChildren();

  if (publicaciones.length === 0) {
    if (textoVacio) {
      textoVacio.hidden = false;
    }
    return;
  }

  if (textoVacio) {
    textoVacio.hidden = true;
  }

  const idUsuarioActivo = usuarioActivo ? usuarioActivo.idUsuario : null;

  for (let i = 0; i < publicaciones.length; i++) {
    const publicacion = publicaciones[i];

    const articulo = document.createElement("article");
    articulo.className = "tarjeta-post";
    articulo.dataset.idPublicacion = publicacion.idPublicacion;

    const encabezado = document.createElement("header");
    encabezado.className = "tarjeta-post-encabezado";

    const titulo = document.createElement("h2");
    titulo.className = "tarjeta-post-titulo";
    titulo.textContent = publicacion.titulo;

    const meta = document.createElement("div");
    meta.className = "tarjeta-post-meta";
    const spanAutor = document.createElement("span");
    spanAutor.className = "tarjeta-post-autor";
    spanAutor.textContent = publicacion.nombreAutor;
    const separador = document.createElement("span");
    separador.className = "tarjeta-post-separador";
    separador.textContent = "·";
    const tiempo = document.createElement("time");
    tiempo.className = "tarjeta-post-fecha";
    tiempo.dateTime = publicacion.fechaIso;
    tiempo.textContent = formatearFechaLegible(publicacion.fechaIso);
    meta.appendChild(spanAutor);
    meta.appendChild(separador);
    meta.appendChild(tiempo);

    const chip = document.createElement("span");
    chip.className =
      "chip-categoria chip-categoria-" + publicacion.categoria;
    chip.textContent = etiquetaCategoria(publicacion.categoria);

    encabezado.appendChild(titulo);
    encabezado.appendChild(meta);
    encabezado.appendChild(chip);

    const cuerpo = document.createElement("div");
    cuerpo.className = "tarjeta-post-cuerpo";
    const lineas = publicacion.contenido.split("\n");
    let huboParrafo = false;
    for (let p = 0; p < lineas.length; p++) {
      const linea = lineas[p];
      if (linea !== "") {
        const parrafo = document.createElement("p");
        parrafo.textContent = linea;
        cuerpo.appendChild(parrafo);
        huboParrafo = true;
      }
    }
    if (!huboParrafo) {
      const parrafo = document.createElement("p");
      parrafo.className = "tarjeta-post-sin-texto";
      parrafo.textContent = "(Sin descripción)";
      cuerpo.appendChild(parrafo);
    }

    const pie = document.createElement("footer");
    pie.className = "tarjeta-post-pie";

    const idsLikes = publicacion.idsUsuariosQueDieronLike;
    const cantidadLikes = idsLikes.length;
    let usuarioYaDioLike = false;
    if (idUsuarioActivo !== null) {
      for (let l = 0; l < idsLikes.length; l++) {
        if (idsLikes[l] === idUsuarioActivo) {
          usuarioYaDioLike = true;
          break;
        }
      }
    }

    const botonLike = document.createElement("button");
    botonLike.type = "button";
    botonLike.className = "boton-like";
    botonLike.dataset.idPublicacion = publicacion.idPublicacion;
    botonLike.setAttribute("aria-pressed", usuarioYaDioLike ? "true" : "false");
    botonLike.setAttribute(
      "aria-label",
      usuarioYaDioLike ? "Quitar me gusta" : "Dar me gusta",
    );
    if (usuarioYaDioLike) {
      botonLike.classList.add("boton-like-activo");
    }

    const icono = document.createElement("span");
    icono.className = "boton-like-icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = "\u2665";

    const contador = document.createElement("span");
    contador.className = "boton-like-contador";
    contador.textContent = String(cantidadLikes);

    botonLike.appendChild(icono);
    botonLike.appendChild(contador);
    pie.appendChild(botonLike);

    articulo.appendChild(encabezado);
    articulo.appendChild(cuerpo);
    articulo.appendChild(pie);
    contenedor.appendChild(articulo);
  }
}

/** Lee el input de búsqueda y vuelve a pintar el feed. */
function filtrarPorBusqueda() {
  const inputBuscador = document.getElementById("inputBuscador");
  textoBusquedaActual = inputBuscador ? inputBuscador.value : "";
  renderizarFeed();
}

/** Lee el select de categoría y vuelve a pintar el feed. */
function filtrarCategoria() {
  const selectCategoria = document.getElementById("selectCategoria");
  categoriaSeleccionada = selectCategoria ? selectCategoria.value : "todas";
  renderizarFeed();
}

/**
 * Si el click fue en un .boton-like, agrega o quita el like del usuario activo.
 */
function manejarClickLike(evento) {
  const objetivo = evento.target.closest(".boton-like");
  const zonaFeed = document.getElementById("contenedorFeed");
  if (!objetivo || !zonaFeed || !zonaFeed.contains(objetivo)) {
    return;
  }

  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  const idPublicacion = objetivo.dataset.idPublicacion;
  if (!idPublicacion) {
    return;
  }

  let publicacion = null;
  for (let i = 0; i < listaPublicaciones.length; i++) {
    if (listaPublicaciones[i].idPublicacion === idPublicacion) {
      publicacion = listaPublicaciones[i];
      break;
    }
  }
  if (!publicacion) {
    return;
  }

  const idUsuario = usuarioActivo.idUsuario;
  let indiceLike = -1;
  for (let j = 0; j < publicacion.idsUsuariosQueDieronLike.length; j++) {
    if (publicacion.idsUsuariosQueDieronLike[j] === idUsuario) {
      indiceLike = j;
      break;
    }
  }

  if (indiceLike === -1) {
    publicacion.idsUsuariosQueDieronLike.push(idUsuario);
  } else {
    publicacion.idsUsuariosQueDieronLike.splice(indiceLike, 1);
  }

  guardarEstadoEnSesionVentana();
  renderizarFeed();
}

/** Arranca la pantalla del feed: exige sesión y engancha eventos. */
function inicializarFeed() {
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  const saludoUsuario = document.getElementById("saludoUsuario");
  if (saludoUsuario) {
    saludoUsuario.textContent = usuarioActivo.nombreCompleto;
  }

  const inputBuscador = document.getElementById("inputBuscador");
  if (inputBuscador) {
    inputBuscador.addEventListener("input", filtrarPorBusqueda);
  }

  const selectCategoria = document.getElementById("selectCategoria");
  if (selectCategoria) {
    selectCategoria.addEventListener("change", filtrarCategoria);
  }

  const contenedorFeed = document.getElementById("contenedorFeed");
  if (contenedorFeed) {
    contenedorFeed.addEventListener("click", manejarClickLike);
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

  renderizarFeed();
}

document.addEventListener("DOMContentLoaded", inicializarFeed);
