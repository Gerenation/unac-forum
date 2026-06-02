require('dotenv').config();

const { conectarDB } = require('./config/database');
const { sembrarSiVacio } = require('./services/seedService');
const app = require('./app');

(async function iniciar() {
  try {
    await conectarDB();
    await sembrarSiVacio();
  } catch (error) {
    console.error('❌ No se pudo inicializar la base de datos:', error.message);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor UNAC Forum corriendo en el puerto ${PORT}`);
  });
})();
