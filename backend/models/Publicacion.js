const mongoose = require('mongoose');

const CATEGORIAS = [
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

const MAX_CATEGORIAS_POR_PUBLICACION = 5;

const publicacionSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [1, 'El título no puede estar vacío'],
      maxlength: [60, 'El título no puede superar 60 caracteres']
    },
    contenido: {
      type: String,
      required: [true, 'El contenido es obligatorio'],
      trim: true
    },
    categorias: {
      type: [
        {
          type: String,
          enum: {
            values: CATEGORIAS,
            message: 'Categoría inválida: {VALUE}'
          }
        }
      ],
      required: [true, 'Debes asignar al menos una categoría'],
      validate: {
        validator(arr) {
          return Array.isArray(arr) && arr.length >= 1 && arr.length <= MAX_CATEGORIAS_POR_PUBLICACION;
        },
        message: `Debes elegir entre 1 y ${MAX_CATEGORIAS_POR_PUBLICACION} categorías`
      }
    },
    idAutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    nombreAutor: {
      type: String,
      required: true,
      trim: true
    },
    fechaIso: {
      type: Date,
      default: Date.now
    },
    idsUsuariosQueDieronLike: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        default: []
      }
    ],
    comentarios: [
      {
        idAutor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Usuario',
          required: true
        },
        nombreAutor: {
          type: String,
          required: true,
          trim: true
        },
        texto: {
          type: String,
          required: [true, 'El texto del comentario es obligatorio'],
          trim: true,
          maxlength: [500, 'El comentario no puede superar 500 caracteres']
        },
        fechaIso: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

publicacionSchema.index({ categorias: 1 });

publicacionSchema.set('toJSON', { getters: true });
publicacionSchema.path('fechaIso').get(function (valor) {
  return valor instanceof Date ? valor.toISOString() : valor;
});

module.exports = mongoose.model('Publicacion', publicacionSchema);
module.exports.CATEGORIAS = CATEGORIAS;
module.exports.MAX_CATEGORIAS_POR_PUBLICACION = MAX_CATEGORIAS_POR_PUBLICACION;
