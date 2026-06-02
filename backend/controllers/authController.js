const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { usuarioPublico } = require('../utils/serializers');

function firmarToken(usuarioId) {
  return jwt.sign({ id: String(usuarioId) }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
}

async function registrar(req, res) {
  try {
    const { nombreCompleto, nombreUsuario, correo, contrasena } = req.body || {};

    if (!nombreCompleto || !nombreUsuario || !correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    if (String(contrasena).length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const usuarioExistente = await Usuario.findOne({
      $or: [
        { correo: String(correo).toLowerCase() },
        { nombreUsuario: new RegExp(`^${escapeRegex(String(nombreUsuario))}$`, 'i') }
      ]
    });
    if (usuarioExistente) {
      const campo = usuarioExistente.correo === String(correo).toLowerCase() ? 'correo' : 'nombre de usuario';
      return res.status(400).json({ mensaje: `Ya existe un usuario con ese ${campo}` });
    }

    const nuevoUsuario = await Usuario.create({
      nombreCompleto,
      nombreUsuario,
      correo,
      contrasena
    });

    const token = firmarToken(nuevoUsuario._id);
    return res.status(201).json({
      token,
      usuario: usuarioPublico(nuevoUsuario)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese correo o nombre de usuario' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: error.message });
    }
    console.error('Error en registrar:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

async function login(req, res) {
  try {
    const { correo, contrasena } = req.body || {};
    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({
      correo: new RegExp(`^${escapeRegex(String(correo))}$`, 'i')
    }).select('+contrasena');

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const coincide = await usuario.compararContrasena(String(contrasena));
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = firmarToken(usuario._id);
    return res.json({
      token,
      usuario: usuarioPublico(usuario)
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

async function obtenerPerfil(req, res) {
  return res.json({ usuario: usuarioPublico(req.usuario) });
}

function escapeRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { registrar, login, obtenerPerfil };
