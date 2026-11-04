const express = require('express');
const router = express.Router();
const { autenticar, esAdmin } = require('../middleware/auth');
const {
  registrar,
  login,
  obtenerPerfil,
  actualizarPerfil,
  listarUsuarios,
  cambiarRolUsuario,
  banearUsuario,
  desbanearUsuario
} = require('../controllers/authController');

router.post('/registro', registrar);
router.post('/login', login);
router.get('/perfil', autenticar, obtenerPerfil);
router.post('/perfil', autenticar, actualizarPerfil);

/**
 * Rutas de administración (solo rol 'admin')
 */
router.get('/usuarios', autenticar, esAdmin, listarUsuarios);
router.post('/usuarios/:id/rol', autenticar, esAdmin, cambiarRolUsuario);
router.post('/usuarios/:id/banear', autenticar, esAdmin, banearUsuario);
router.post('/usuarios/:id/desbanear', autenticar, esAdmin, desbanearUsuario);

module.exports = router;
