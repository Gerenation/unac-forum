const { CATEGORIAS } = require('../models/Publicacion');

/**
 * Normaliza categorías desde documentos nuevos (array) o legacy (campo único).
 * @param {Object} doc - Documento de publicación de Mongoose.
 * @returns {string[]} Lista de categorías válidas sin duplicados.
 */
function extraerCategorias(doc) {
  if (!doc) return [];
  if (Array.isArray(doc.categorias) && doc.categorias.length > 0) {
    return [...new Set(doc.categorias.filter((c) => CATEGORIAS.includes(c)))];
  }
  if (doc.categoria && CATEGORIAS.includes(doc.categoria)) {
    return [doc.categoria];
  }
  return ['general'];
}

function usuarioPublico(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id),
    nombreCompleto: doc.nombreCompleto,
    nombreUsuario: doc.nombreUsuario,
    correo: doc.correo
  };
}

function publicacionPublico(doc, usuarioId) {
  if (!doc) return null;
  const likesIds = (doc.idsUsuariosQueDieronLike || []).map((id) => String(id));
  const usuarioYaDioLike = usuarioId
    ? likesIds.includes(String(usuarioId))
    : false;
  const fecha = doc.fechaIso instanceof Date ? doc.fechaIso.toISOString() : doc.fechaIso;
  const comentarios = (doc.comentarios || []).map((c) => ({
    idAutor: String(c.idAutor),
    nombreAutor: c.nombreAutor,
    texto: c.texto,
    fechaIso: c.fechaIso instanceof Date ? c.fechaIso.toISOString() : c.fechaIso
  }));
  const categorias = extraerCategorias(doc);
  return {
    id: String(doc._id),
    titulo: doc.titulo,
    contenido: doc.contenido,
    categorias,
    categoria: categorias[0],
    idAutor: String(doc.idAutor),
    nombreAutor: doc.nombreAutor,
    fechaIso: fecha,
    likes: likesIds,
    cantidadLikes: likesIds.length,
    usuarioYaDioLike,
    comentarios,
    cantidadComentarios: comentarios.length
  };
}

module.exports = { usuarioPublico, publicacionPublico, extraerCategorias };
