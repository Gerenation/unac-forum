const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth');
const { listar, crear, toggleLike, eliminar, agregarComentario } = require('../controllers/publicacionController');

router.use(autenticar);

router.get('/', listar);
router.post('/', crear);
router.post('/:id/like', toggleLike);
router.post('/:id/comentarios', agregarComentario);
router.delete('/:id', eliminar);

module.exports = router;
