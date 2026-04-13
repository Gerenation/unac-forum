/* ======================================================================================================================
   CAPA DE DATOS (datos.js)
   Aquí viven los arreglos de usuarios y publicaciones, más el usuario logueado.

   Cómo se guardan los datos al cambiar de página (sin localStorage ni JSON)
   Usamos la propiedad window.name (es un string que el navegador conserva)
   mientras la pestaña siga abierta, aunque pases de feed.html a otra página.

   Armamos un texto con líneas y el separador "###" entre campos.
   encodeURIComponent / decodeURIComponent sirven para que títulos o textos
   largos no rompan el formato, estas son funciones del navegador, no son JSON.

   ====================================================================================================================== */

const LONGITUD_MAXIMA_TITULO = 60;

const CATEGORIAS_DISPONIBLES = [
  "convocatoria",
  "evento",
  "alertaAcademica",
  "bienestar",
  "tecnologia",
  "deportes",
  "cultura",
  "general",
];

const USUARIOS_DUMMY = [
  {
    idUsuario: "usr-001",
    nombreUsuario: "pepitoPerez",
    correo: "pepito.perez@estudiantes.unac.edu",
    contrasena: "demo123",
    nombreCompleto: "Pepito Pérez",
  },
  {
    idUsuario: "usr-002",
    nombreUsuario: "ThefulanoDeTal",
    correo: "fulano.de.tal@estudiantes.unac.edu",
    contrasena: "demo123",
    nombreCompleto: "Fulano de Tal",
  },
];

const PUBLICACIONES_INICIALES = [
  {
    idPublicacion: "pub-001",
    titulo: "Club de lectura: ciencia ficción latinoamericana",
    contenido:
      "Se abre inscripción para el círculo de lectura del mes. Nos reunimos los viernes en la biblioteca central. Cupos limitados.",
    categoria: "cultura",
    idAutor: "usr-001",
    nombreAutor: "Pepito Pérez",
    fechaIso: "2026-04-01T15:00:00.000Z",
    idsUsuariosQueDieronLike: ["usr-002"],
  },
  {
    idPublicacion: "pub-002",
    titulo: "Taller de bienestar emocional (gratuito)",
    contenido:
      "La psicología estudiantil ofrece cuatro sesiones sobre manejo del estrés en parciales. Inscripción en ventanilla 3.",
    categoria: "bienestar",
    idAutor: "usr-002",
    nombreAutor: "Fulano de Tal",
    fechaIso: "2026-04-03T10:30:00.000Z",
    idsUsuariosQueDieronLike: [],
  },
];

/** Primera línea del guardado: sirve para saber si el texto es nuestro formato. */
const MARCA_GUARDADO = "UNAC_FORUM_V1";

/** Separamos campos con tres numerales para que sea fácil de partir con split(). */
const SEP = "###";

let listaUsuarios = [];
let listaPublicaciones = [];
let usuarioActivo = null;

/**
 * Llena listaUsuarios copiando los usuarios de prueba (objetos nuevos, no la misma referencia).
 */
function copiarUsuariosDesdeDummy() {
  listaUsuarios = [];
  for (let i = 0; i < USUARIOS_DUMMY.length; i++) {
    const original = USUARIOS_DUMMY[i];
    listaUsuarios.push({
      idUsuario: original.idUsuario,
      nombreUsuario: original.nombreUsuario,
      correo: original.correo,
      contrasena: original.contrasena,
      nombreCompleto: original.nombreCompleto,
    });
  }
}

/**
 * Llena listaPublicaciones con las publicaciones de ejemplo.
 */
function copiarPublicacionesDesdeIniciales() {
  listaPublicaciones = [];
  for (let i = 0; i < PUBLICACIONES_INICIALES.length; i++) {
    const original = PUBLICACIONES_INICIALES[i];
    const likes = [];
    for (let j = 0; j < original.idsUsuariosQueDieronLike.length; j++) {
      likes.push(original.idsUsuariosQueDieronLike[j]);
    }
    listaPublicaciones.push({
      idPublicacion: original.idPublicacion,
      titulo: original.titulo,
      contenido: original.contenido,
      categoria: original.categoria,
      idAutor: original.idAutor,
      nombreAutor: original.nombreAutor,
      fechaIso: original.fechaIso,
      idsUsuariosQueDieronLike: likes,
    });
  }
}

/**
 * Convierte el estado actual a texto y lo guarda en window.name.
 * Debes llamar esto después de login, registro, nuevo post o like.
 */
function guardarEstadoEnSesionVentana() {
  let texto = MARCA_GUARDADO + "\n";

  // Bloque ACTIVO: quién está logueado (sin contraseña).
  if (usuarioActivo === null) {
    texto += "ACTIVO:\n";
  } else {
    texto +=
      "ACTIVO:" +
      usuarioActivo.idUsuario +
      SEP +
      usuarioActivo.nombreUsuario +
      SEP +
      usuarioActivo.correo +
      SEP +
      usuarioActivo.nombreCompleto +
      "\n";
  }

  // Lista de usuarios (incluye contraseña para que el login siga funcionando).
  texto += "USUARIOS\n";
  for (let i = 0; i < listaUsuarios.length; i++) {
    const u = listaUsuarios[i];
    texto +=
      u.idUsuario +
      SEP +
      u.nombreUsuario +
      SEP +
      u.correo +
      SEP +
      u.contrasena +
      SEP +
      u.nombreCompleto +
      "\n";
  }

  // Lista de publicaciones (título y texto van “codificados” para no romper líneas).
  texto += "PUBLICACIONES\n";
  for (let j = 0; j < listaPublicaciones.length; j++) {
    const p = listaPublicaciones[j];
    let likesTexto = "";
    for (let k = 0; k < p.idsUsuariosQueDieronLike.length; k++) {
      if (k > 0) {
        likesTexto += ",";
      }
      likesTexto += p.idsUsuariosQueDieronLike[k];
    }
    texto +=
      p.idPublicacion +
      SEP +
      encodeURIComponent(p.titulo) +
      SEP +
      encodeURIComponent(p.contenido) +
      SEP +
      p.categoria +
      SEP +
      p.idAutor +
      SEP +
      encodeURIComponent(p.nombreAutor) +
      SEP +
      p.fechaIso +
      SEP +
      likesTexto +
      "\n";
  }

  window.name = texto;
}

/**
 * Lee window.name y, si tiene nuestro formato, llena listaUsuarios, listaPublicaciones y usuarioActivo.
 * Devuelve true si cargó datos guardados, false si no había nada útil.
 */
function cargarEstadoDesdeSesionVentana() {
  const texto = window.name;
  if (!texto || texto.indexOf(MARCA_GUARDADO) !== 0) {
    return false;
  }

  const lineas = texto.split("\n");
  let modo = "nada";
  listaUsuarios = [];
  listaPublicaciones = [];
  usuarioActivo = null;

  for (let i = 1; i < lineas.length; i++) {
    const linea = lineas[i];

    if (linea === "USUARIOS") {
      modo = "usuarios";
      continue;
    }
    if (linea === "PUBLICACIONES") {
      modo = "publicaciones";
      continue;
    }

    // Línea del usuario activo (sesión actual).
    if (linea.indexOf("ACTIVO:") === 0) {
      const datos = linea.substring("ACTIVO:".length);
      if (datos === "") {
        continue;
      }
      const partes = datos.split(SEP);
      if (partes.length === 4) {
        usuarioActivo = {
          idUsuario: partes[0],
          nombreUsuario: partes[1],
          correo: partes[2],
          nombreCompleto: partes[3],
        };
      }
      continue;
    }

    if (modo === "usuarios" && linea !== "") {
      const partes = linea.split(SEP);
      if (partes.length === 5) {
        listaUsuarios.push({
          idUsuario: partes[0],
          nombreUsuario: partes[1],
          correo: partes[2],
          contrasena: partes[3],
          nombreCompleto: partes[4],
        });
      }
    }

    if (modo === "publicaciones" && linea !== "") {
      const partes = linea.split(SEP);
      if (partes.length >= 8) {
        let likes = [];
        if (partes[7] !== "") {
          const trozos = partes[7].split(",");
          for (let m = 0; m < trozos.length; m++) {
            if (trozos[m] !== "") {
              likes.push(trozos[m]);
            }
          }
        }
        listaPublicaciones.push({
          idPublicacion: partes[0],
          titulo: decodeURIComponent(partes[1]),
          contenido: decodeURIComponent(partes[2]),
          categoria: partes[3],
          idAutor: partes[4],
          nombreAutor: decodeURIComponent(partes[5]),
          fechaIso: partes[6],
          idsUsuariosQueDieronLike: likes,
        });
      }
    }
  }

  return true;
}

/**
 * Al abrir cualquier página intentamos cargar lo guardado en la pestaña;
 * si no hay datos, partimos de los arreglos de ejemplo.
 */
function inicializarDatosCompartidos() {
  const huboGuardado = cargarEstadoDesdeSesionVentana();
  // Si no había archivo guardado o vino vacío/corrupto, volvemos a los datos de ejemplo.
  if (!huboGuardado || listaUsuarios.length === 0) {
    copiarUsuariosDesdeDummy();
    copiarPublicacionesDesdeIniciales();
    usuarioActivo = null;
    guardarEstadoEnSesionVentana();
  }
}

inicializarDatosCompartidos();
