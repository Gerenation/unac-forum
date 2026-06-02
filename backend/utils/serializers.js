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
  return {
    id: String(doc._id),
    titulo: doc.titulo,
    contenido: doc.contenido,
    categoria: doc.categoria,
    idAutor: String(doc.idAutor),
    nombreAutor: doc.nombreAutor,
    fechaIso: fecha,
    likes: likesIds,
    cantidadLikes: likesIds.length,
    usuarioYaDioLike
  };
}

module.exports = { usuarioPublico, publicacionPublico };
