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

async function actualizarPerfil(req, res) {
  try {
    const {
      nombreCompleto,
      nombreUsuario,
      correo,
      contrasenaActual,
      contrasenaNueva
    } = req.body || {};

    let doc = req.usuario;
    let requiereGuardar = false;

    if (contrasenaNueva !== undefined && String(contrasenaNueva).length > 0) {
      if (!contrasenaActual) {
        return res.status(400).json({ mensaje: 'Debes proporcionar la contraseña actual' });
      }
      if (String(contrasenaNueva).length < 6) {
        return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
      }
      doc = await Usuario.findById(req.usuario._id).select('+contrasena');
      const coincide = await doc.compararContrasena(String(contrasenaActual));
      if (!coincide) {
        return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
      }
      doc.contrasena = String(contrasenaNueva);
      requiereGuardar = true;
    }

    if (nombreCompleto !== undefined && String(nombreCompleto).trim() !== req.usuario.nombreCompleto) {
      const limpio = String(nombreCompleto).trim();
      if (limpio.length < 2) {
        return res.status(400).json({ mensaje: 'El nombre debe tener al menos 2 caracteres' });
      }
      doc.nombreCompleto = limpio;
      requiereGuardar = true;
    }

    if (nombreUsuario !== undefined && String(nombreUsuario).trim() !== req.usuario.nombreUsuario) {
      const limpio = String(nombreUsuario).trim();
      if (limpio.length < 2) {
        return res.status(400).json({ mensaje: 'El nombre de usuario debe tener al menos 2 caracteres' });
      }
      const usuarioExistente = await Usuario.findOne({
        _id: { $ne: doc._id },
        nombreUsuario: new RegExp(`^${escapeRegex(limpio)}$`, 'i')
      });
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'Ya existe un usuario con ese nombre de usuario' });
      }
      doc.nombreUsuario = limpio;
      requiereGuardar = true;
    }

    if (correo !== undefined && String(correo).toLowerCase() !== req.usuario.correo) {
      const limpio = String(correo).toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(limpio)) {
        return res.status(400).json({ mensaje: 'Correo inválido' });
      }
      const usuarioExistente = await Usuario.findOne({
        _id: { $ne: doc._id },
        correo: limpio
      });
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'Ya existe un usuario con ese correo' });
      }
      doc.correo = limpio;
      requiereGuardar = true;
    }

    if (!requiereGuardar) {
      return res.status(400).json({ mensaje: 'No hay cambios para guardar' });
    }

    await doc.save();
    return res.json({ usuario: usuarioPublico(doc) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese correo o nombre de usuario' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: error.message });
    }
    console.error('Error en actualizarPerfil:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

function escapeRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { registrar, login, obtenerPerfil, actualizarPerfil };
