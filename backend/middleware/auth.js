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

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

module.exports = { autenticar };
