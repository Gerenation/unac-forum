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
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: {
        values: CATEGORIAS,
        message: 'Categoría inválida'
      },
      default: 'general'
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
    ]
  },
  { timestamps: true }
);

publicacionSchema.set('toJSON', { getters: true });
publicacionSchema.path('fechaIso').get(function (valor) {
  return valor instanceof Date ? valor.toISOString() : valor;
});

module.exports = mongoose.model('Publicacion', publicacionSchema);
module.exports.CATEGORIAS = CATEGORIAS;
