const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth');
const { registrar, login, obtenerPerfil } = require('../controllers/authController');

router.post('/registro', registrar);
router.post('/login', login);
router.get('/perfil', autenticar, obtenerPerfil);

module.exports = router;
