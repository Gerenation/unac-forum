const Publicacion = require('../models/Publicacion');
const { LONGITUD_MAXIMA_TITULO } = require('../utils/seedData');
const { publicacionPublico } = require('../utils/serializers');
const { CATEGORIAS } = require('../models/Publicacion');

function escapeRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listar(req, res) {
  try {
    const q = (req.query.q || '').toString().trim();
    const categoria = (req.query.categoria || 'todas').toString();

    const filtro = {};
    if (categoria && categoria !== 'todas') {
      filtro.categoria = categoria;
    }
    if (q) {
      const patron = new RegExp(escapeRegex(q), 'i');
      filtro.$or = [{ titulo: patron }, { contenido: patron }, { nombreAutor: patron }];
    }

    const publicaciones = await Publicacion.find(filtro).sort({ fechaIso: -1 });
    const datos = publicaciones.map((p) => publicacionPublico(p, req.usuario._id));
    return res.json({ publicaciones: datos });
  } catch (error) {
    console.error('Error en listar:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

async function crear(req, res) {
  try {
    const { titulo, contenido, categoria } = req.body || {};

    if (!titulo || !String(titulo).trim()) {
      return res.status(400).json({ mensaje: 'El título es obligatorio' });
    }
    if (!contenido || !String(contenido).trim()) {
      return res.status(400).json({ mensaje: 'El contenido es obligatorio' });
    }
    if (!categoria || !CATEGORIAS.includes(categoria)) {
      return res.status(400).json({ mensaje: 'Categoría inválida' });
    }
    if (String(titulo).trim().length > LONGITUD_MAXIMA_TITULO) {
      return res.status(400).json({
        mensaje: `El título no puede superar ${LONGITUD_MAXIMA_TITULO} caracteres`
      });
    }

    const nueva = await Publicacion.create({
      titulo: String(titulo).trim(),
      contenido: String(contenido).trim(),
      categoria,
      idAutor: req.usuario._id,
      nombreAutor: req.usuario.nombreCompleto,
      fechaIso: new Date(),
      idsUsuariosQueDieronLike: []
    });

    return res.status(201).json({ publicacion: publicacionPublico(nueva, req.usuario._id) });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: error.message });
    }
    console.error('Error en crear:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

async function toggleLike(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario._id;

    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }

    const yaDioLike = publicacion.idsUsuariosQueDieronLike.some(
      (uid) => String(uid) === String(usuarioId)
    );

    let actualizada;
    if (yaDioLike) {
      actualizada = await Publicacion.findByIdAndUpdate(
        id,
        { $pull: { idsUsuariosQueDieronLike: usuarioId } },
        { new: true }
      );
    } else {
      actualizada = await Publicacion.findByIdAndUpdate(
        id,
        { $addToSet: { idsUsuariosQueDieronLike: usuarioId } },
        { new: true }
      );
    }

    return res.json({ publicacion: publicacionPublico(actualizada, usuarioId) });
  } catch (error) {
    console.error('Error en toggleLike:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario._id;

    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }

    if (String(publicacion.idAutor) !== String(usuarioId)) {
      return res.status(403).json({ mensaje: 'No autorizado para eliminar esta publicación' });
    }

    await Publicacion.findByIdAndDelete(id);
    return res.json({ mensaje: 'Publicación eliminada' });
  } catch (error) {
    console.error('Error en eliminar:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

async function agregarComentario(req, res) {
  try {
    const { id } = req.params;
    const { texto } = req.body || {};

    if (!texto || !String(texto).trim()) {
      return res.status(400).json({ mensaje: 'El comentario no puede estar vacío' });
    }
    const textoLimpio = String(texto).trim();
    if (textoLimpio.length > 500) {
      return res.status(400).json({ mensaje: 'El comentario no puede superar 500 caracteres' });
    }

    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }

    const actualizada = await Publicacion.findByIdAndUpdate(
      id,
      {
        $push: {
          comentarios: {
            idAutor: req.usuario._id,
            nombreAutor: req.usuario.nombreCompleto,
            texto: textoLimpio,
            fechaIso: new Date()
          }
        }
      },
      { new: true, runValidators: true }
    );

    return res.status(201).json({ publicacion: publicacionPublico(actualizada, req.usuario._id) });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: error.message });
    }
    console.error('Error en agregarComentario:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

module.exports = { listar, crear, toggleLike, eliminar, agregarComentario };
