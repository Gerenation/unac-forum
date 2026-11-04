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

/**
 * Asegura que todos los usuarios existentes tengan el campo `rol`.
 * Los usuarios creados antes de esta feature se asignan como 'usuario'.
 */
async function migrarRolesUsuarios() {
  const resultado = await Usuario.updateMany(
    { rol: { $exists: false } },
    { $set: { rol: 'usuario' } }
  );
  if (resultado.modifiedCount > 0) {
    console.log(`🔄 Roles asignados a ${resultado.modifiedCount} usuario(es) existente(s).`);
  }
}

async function sembrarSiVacio() {
  await migrarCategoriasLegacy();
  await migrarRolesUsuarios();

  const totalUsuarios = await Usuario.countDocuments();
  const totalPublicaciones = await Publicacion.countDocuments();

  // Agregar usuarios faltantes si hay menos de los definidos en seed data
  let usuariosCreados = [];
  if (totalUsuarios < USUARIOS_DUMMY.length) {
    const usuariosExistentes = await Usuario.find().select('nombreUsuario correo');
    const nombresExistentes = new Set(
      usuariosExistentes.map((u) => u.nombreUsuario?.toLowerCase())
    );
    const correosExistentes = new Set(
      usuariosExistentes.map((u) => u.correo?.toLowerCase())
    );

    for (const datos of USUARIOS_DUMMY) {
      if (
        !nombresExistentes.has(datos.nombreUsuario.toLowerCase()) &&
        !correosExistentes.has(datos.correo.toLowerCase())
      ) {
        const u = await Usuario.create(datos);
        usuariosCreados.push(u);
      }
    }
    if (usuariosCreados.length > 0) {
      console.log(`🌱 Usuarios demo adicionales insertados: ${usuariosCreados.length}`);
    }
  }

  usuariosCreados = usuariosCreados.length > 0 ? usuariosCreados : await Usuario.find();

  // Agregar publicaciones faltantes si hay menos de las definidas en seed data
  if (totalPublicaciones < PUBLICACIONES_INICIALES.length) {
    const publicacionesExistentes = await Publicacion.find().select('titulo');
    const titulosExistentes = new Set(
      publicacionesExistentes.map((p) => p.titulo?.toLowerCase().trim())
    );

    const docs = [];
    for (const p of PUBLICACIONES_INICIALES) {
      if (!titulosExistentes.has(p.titulo.toLowerCase().trim())) {
        const autor = usuariosCreados[p.autorIndice] || usuariosCreados[0];
        docs.push({
          titulo: p.titulo,
          contenido: p.contenido,
          categorias: p.categorias,
          idAutor: autor._id,
          nombreAutor: p.nombreAutor,
          fechaIso: p.fechaIso,
          idsUsuariosQueDieronLike: (p.likesIndice || [])
            .map((idx) => usuariosCreados[idx]?._id)
            .filter(Boolean)
        });
      }
    }
    if (docs.length > 0) {
      const publicacionesCreadas = await Publicacion.insertMany(docs);
      console.log(
        `🌱 Publicaciones demo adicionales insertadas: ${publicacionesCreadas.length}`
      );
    }
  }

  const totalUsuariosFinal = await Usuario.countDocuments();
  const totalPublicacionesFinal = await Publicacion.countDocuments();
  console.log(
    `📊 Estado BD: ${totalUsuariosFinal} usuario(s), ${totalPublicacionesFinal} publicación(es)`
  );
}

module.exports = { sembrarSiVacio, migrarCategoriasLegacy };
