/**
 * Datos de ejemplo para sembrar la base de datos la primera vez.
 * Las publicaciones demo usan varias categorías para reflejar la intención del autor.
 */

const LONGITUD_MAXIMA_TITULO = 60;
const MAX_CATEGORIAS_POR_PUBLICACION = 5;

const CATEGORIAS_DISPONIBLES = [
  'convocatoria',
  'evento',
  'alertaAcademica',
  'bienestar',
  'tecnologia',
  'deportes',
  'cultura',
  'general',
  'socializacion'
];

const USUARIOS_DUMMY = [
  {
    nombreUsuario: 'pepitoPerez',
    correo: 'pepito.perez@estudiantes.unac.edu',
    contrasena: 'demo123',
    nombreCompleto: 'Pepito Pérez'
  },
  {
    nombreUsuario: 'ThefulanoDeTal',
    correo: 'fulano.de.tal@estudiantes.unac.edu',
    contrasena: 'demo123',
    nombreCompleto: 'Fulano de Tal'
  }
];

const PUBLICACIONES_INICIALES = [
  {
    titulo: 'Club de lectura: ciencia ficción latinoamericana',
    contenido:
      'Se abre inscripción para el círculo de lectura del mes. Nos reunimos los viernes en la biblioteca central. Cupos limitados.',
    categorias: ['cultura', 'evento', 'socializacion'],
    autorIndice: 0,
    nombreAutor: 'Pepito Pérez',
    fechaIso: new Date('2026-04-01T15:00:00.000Z'),
    likesIndice: [1]
  },
  {
    titulo: 'Taller de bienestar emocional (gratuito)',
    contenido:
      'La psicología estudiantil ofrece cuatro sesiones sobre manejo del estrés en parciales. Inscripción en ventanilla 3.',
    categorias: ['bienestar', 'alertaAcademica'],
    autorIndice: 1,
    nombreAutor: 'Fulano de Tal',
    fechaIso: new Date('2026-04-03T10:30:00.000Z'),
    likesIndice: []
  },
  {
    titulo: 'Sale parche al cerro de las 3 cruces',
    contenido: 'el domingo 19 de abril cupos limitados (habrá comida)',
    categorias: ['socializacion', 'deportes', 'evento'],
    autorIndice: 0,
    nombreAutor: 'Pepito Pérez',
    fechaIso: new Date('2026-04-04T10:30:00.000Z'),
    likesIndice: []
  }
];

module.exports = {
  LONGITUD_MAXIMA_TITULO,
  MAX_CATEGORIAS_POR_PUBLICACION,
  CATEGORIAS_DISPONIBLES,
  USUARIOS_DUMMY,
  PUBLICACIONES_INICIALES
};
