const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

async function autenticar(req, res, next) {
  try {
    const encabezado = req.headers.authorization || '';
    const token = encabezado.startsWith('Bearer ') ? encabezado.slice(7) : null;
    if (!token) {
      return res.status(401).json({ mensaje: 'No autenticado: token ausente' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select('-contrasena');
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Token inválido: usuario no existe' });
    }

    if (usuario.baneado) {
      return res.status(403).json({
        mensaje: 'Usuario baneado',
        razon: usuario.razonBaneo || 'Sin razón especificada',
        fechaBaneo: usuario.fechaBaneo
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

/**
 * Middleware: solo permite continuar si el usuario autenticado tiene rol 'admin'.
 * Debe usarse DESPUÉS de `autenticar` (que ya carga req.usuario).
 */
function esAdmin(req, res, next) {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado: se requiere rol de administrador' });
  }
  next();
}

module.exports = { autenticar, esAdmin };
