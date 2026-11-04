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
    nombreUsuario: 'admin',
    correo: 'admin@unac.edu',
    contrasena: 'admin123',
    nombreCompleto: 'Administrador UNAC',
    rol: 'admin'
  },
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
  },
  {
    nombreUsuario: 'mariaGarcia',
    correo: 'maria.garcia@estudiantes.unac.edu',
    contrasena: 'demo123',
    nombreCompleto: 'María García López'
  },
  {
    nombreUsuario: 'carlosRuiz',
    correo: 'carlos.ruiz@estudiantes.unac.edu',
    contrasena: 'demo123',
    nombreCompleto: 'Carlos Ruiz Martínez'
  },
  {
    nombreUsuario: 'anaSilva',
    correo: 'ana.silva@estudiantes.unac.edu',
    contrasena: 'demo123',
    nombreCompleto: 'Ana Silva Castro'
  },
  {
    nombreUsuario: 'luisFernandez',
    correo: 'luis.fernandez@estudiantes.unac.edu',
    contrasena: 'demo123',
    nombreCompleto: 'Luis Fernández Díaz'
  },
  {
    nombreUsuario: 'elenaMorales',
    correo: 'elena.morales@estudiantes.unac.edu',
    contrasena: 'demo123',
    nombreCompleto: 'Elena Morales Vega'
  }
];

const PUBLICACIONES_INICIALES = [
  {
    titulo: 'Club de lectura: ciencia ficción latinoamericana',
    contenido:
      'Se abre inscripción para el círculo de lectura del mes. Nos reunimos los viernes en la biblioteca central. Cupos limitados.',
    categorias: ['cultura', 'evento', 'socializacion'],
    autorIndice: 1,
    nombreAutor: 'Pepito Pérez',
    fechaIso: new Date('2026-04-01T15:00:00.000Z'),
    likesIndice: [3, 4]
  },
  {
    titulo: 'Taller de bienestar emocional (gratuito)',
    contenido:
      'La psicología estudiantil ofrece cuatro sesiones sobre manejo del estrés en parciales. Inscripción en ventanilla 3.',
    categorias: ['bienestar', 'alertaAcademica'],
    autorIndice: 2,
    nombreAutor: 'Fulano de Tal',
    fechaIso: new Date('2026-04-03T10:30:00.000Z'),
    likesIndice: [1, 5]
  },
  {
    titulo: 'Sale parche al cerro de las 3 cruces',
    contenido: 'el domingo 19 de abril cupos limitados (habrá comida)',
    categorias: ['socializacion', 'deportes', 'evento'],
    autorIndice: 1,
    nombreAutor: 'Pepito Pérez',
    fechaIso: new Date('2026-04-04T10:30:00.000Z'),
    likesIndice: [2, 3, 4]
  },
  {
    titulo: 'Convocatoria de becas de intercambio académico',
    contenido:
      'La oficina de relaciones internacionales abre convocatoria para semestre de intercambio en universidades de España y México. Fecha límite: 15 de mayo.',
    categorias: ['convocatoria', 'alertaAcademica'],
    autorIndice: 3,
    nombreAutor: 'María García López',
    fechaIso: new Date('2026-04-05T09:00:00.000Z'),
    likesIndice: [1, 2, 6]
  },
  {
    titulo: 'Partido de fútbol inter facultades este sábado',
    contenido:
      'Se organiza partido amistoso entre la facultad de ingeniería y artes. Cancha principal a las 4 pm. Se invita a todos.',
    categorias: ['deportes', 'evento', 'socializacion'],
    autorIndice: 4,
    nombreAutor: 'Carlos Ruiz Martínez',
    fechaIso: new Date('2026-04-06T14:00:00.000Z'),
    likesIndice: [1, 3, 5, 7]
  },
  {
    titulo: 'Taller de programación en Python para principiantes',
    contenido:
      'El club de tecnología ofrece taller introductorio a Python los martes y jueves de 6 a 8 pm en el laboratorio 4. Inscripción previa.',
    categorias: ['tecnologia', 'evento', 'general'],
    autorIndice: 5,
    nombreAutor: 'Ana Silva Castro',
    fechaIso: new Date('2026-04-07T11:00:00.000Z'),
    likesIndice: [2, 4, 6]
  },
  {
    titulo: 'Exposición de fotografía estudiantil en la galería central',
    contenido:
      'Muestra de trabajos finales del curso de fotografía. Abierta al público del 10 al 20 de abril. Entrada libre.',
    categorias: ['cultura', 'evento', 'general'],
    autorIndice: 6,
    nombreAutor: 'Luis Fernández Díaz',
    fechaIso: new Date('2026-04-08T16:00:00.000Z'),
    likesIndice: [1, 3, 5]
  },
  {
    titulo: 'Charla sobre salud mental y manejo de ansiedad',
    contenido:
      'Bienestar universitario invita a charla con psicólogo invitado. Miércoles 22 de abril a las 5 pm en el auditorio A.',
    categorias: ['bienestar', 'alertaAcademica', 'evento'],
    autorIndice: 7,
    nombreAutor: 'Elena Morales Vega',
    fechaIso: new Date('2026-04-09T10:00:00.000Z'),
    likesIndice: [2, 4, 6, 7]
  }
];

module.exports = {
  LONGITUD_MAXIMA_TITULO,
  MAX_CATEGORIAS_POR_PUBLICACION,
  CATEGORIAS_DISPONIBLES,
  USUARIOS_DUMMY,
  PUBLICACIONES_INICIALES
};
