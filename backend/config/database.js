const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/unac_forum';

function obtenerUriPorDefecto() {
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim() !== '') {
    return process.env.MONGODB_URI;
  }
  return DEFAULT_URI;
}

async function conectarDB() {
  const uri = obtenerUriPorDefecto();
  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB conectado: ${uri}`);
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    throw error;
  }
}

module.exports = { conectarDB, obtenerUriPorDefecto };
