const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nombreCompleto: {
      type: String,
      required: [true, 'El nombre completo es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    nombreUsuario: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre de usuario debe tener al menos 2 caracteres']
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Correo inválido']
    },
    contrasena: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false
    }
  },
  { timestamps: true }
);

usuarioSchema.index(
  { nombreUsuario: 1 },
  { collation: { locale: 'es', strength: 2 } }
);
usuarioSchema.index(
  { correo: 1 },
  { collation: { locale: 'es', strength: 2 } }
);

usuarioSchema.pre('save', async function (siguiente) {
  if (!this.isModified('contrasena')) return siguiente();
  try {
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
    siguiente();
  } catch (error) {
    siguiente(error);
  }
});

usuarioSchema.methods.compararContrasena = async function (contrasenaPlana) {
  return bcrypt.compare(contrasenaPlana, this.contrasena);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
