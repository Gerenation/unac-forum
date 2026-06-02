require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const publicacionRoutes = require('./routes/publicacionRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true, limit: '8mb' }));

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de UNAC Forum funcionando correctamente', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/publicaciones', publicacionRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error desconocido'
  });
});

module.exports = app;
