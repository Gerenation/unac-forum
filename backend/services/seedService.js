const Usuario = require('../models/Usuario');
const Publicacion = require('../models/Publicacion');
const {
  USUARIOS_DUMMY,
  PUBLICACIONES_INICIALES
} = require('../utils/seedData');

async function sembrarSiVacio() {
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
    // Use .create() one at a time so the pre('save') bcrypt hook fires
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
        categoria: p.categoria,
        idAutor: autor._id,
        nombreAutor: p.nombreAutor,
        fechaIso: p.fechaIso,
        idsUsuariosQueDieronLike: (p.likesIndice || []).map(
          (idx) => usuariosCreados[idx]?._id
        ).filter(Boolean)
      };
    });
    const publicacionesCreadas = await Publicacion.insertMany(docs);
    console.log(`🌱 Publicaciones demo insertadas: ${publicacionesCreadas.length}`);
  }
}

module.exports = { sembrarSiVacio };
