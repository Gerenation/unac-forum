const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth');
const { registrar, login, obtenerPerfil, actualizarPerfil } = require('../controllers/authController');

router.post('/registro', registrar);
router.post('/login', login);
router.get('/perfil', autenticar, obtenerPerfil);
router.post('/perfil', autenticar, actualizarPerfil);

module.exports = router;
