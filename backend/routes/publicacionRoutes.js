const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth');
const { listar, crear, toggleLike } = require('../controllers/publicacionController');

router.use(autenticar);

router.get('/', listar);
router.post('/', crear);
router.post('/:id/like', toggleLike);

module.exports = router;
