const Usuario = require('../models/Usuario');
const Publicacion = require('../models/Publicacion');
const {
  USUARIOS_DUMMY,
  PUBLICACIONES_INICIALES
} = require('../utils/seedData');

/**
 * Convierte publicaciones antiguas con campo único `categoria` al nuevo arreglo `categorias`.
 */
async function migrarCategoriasLegacy() {
  const legacy = await Publicacion.collection
    .find({
      categoria: { $exists: true, $ne: null },
      $or: [{ categorias: { $exists: false } }, { categorias: { $size: 0 } }]
    })
    .toArray();

  if (legacy.length === 0) return;

  for (const doc of legacy) {
    const categorias =
      Array.isArray(doc.categorias) && doc.categorias.length > 0
        ? doc.categorias
        : [doc.categoria];
    await Publicacion.collection.updateOne(
      { _id: doc._id },
      { $set: { categorias }, $unset: { categoria: '' } }
    );
  }
  console.log(`🔄 Migradas ${legacy.length} publicación(es) al formato multi-categoría.`);
}

async function sembrarSiVacio() {
  await migrarCategoriasLegacy();

  const totalUsuarios = await Usuario.countDocuments();
  const totalPublicaciones = await Publicacion.countDocuments();

  if (totalUsuarios > 0 && totalPublicaciones > 0) {
    console.log(
      `ℹ️  Seed omitido: ya hay ${totalUsuarios} usuarios y ${totalPublicaciones} publicaciones.`
    );
    return;
  }

  let usuariosCreados = [];
  if (totalUsuarios === 0) {
    for (const datos of USUARIOS_DUMMY) {
      const u = await Usuario.create(datos);
      usuariosCreados.push(u);
    }
    console.log(`🌱 Usuarios demo insertados: ${usuariosCreados.length}`);
  } else {
    usuariosCreados = await Usuario.find();
  }

  if (totalPublicaciones === 0 && usuariosCreados.length > 0) {
    const docs = PUBLICACIONES_INICIALES.map((p) => {
      const autor = usuariosCreados[p.autorIndice] || usuariosCreados[0];
      return {
        titulo: p.titulo,
        contenido: p.contenido,
        categorias: p.categorias,
        idAutor: autor._id,
        nombreAutor: p.nombreAutor,
        fechaIso: p.fechaIso,
        idsUsuariosQueDieronLike: (p.likesIndice || [])
          .map((idx) => usuariosCreados[idx]?._id)
          .filter(Boolean)
      };
    });
    const publicacionesCreadas = await Publicacion.insertMany(docs);
    console.log(`🌱 Publicaciones demo insertadas: ${publicacionesCreadas.length}`);
  }
}

module.exports = { sembrarSiVacio, migrarCategoriasLegacy };
