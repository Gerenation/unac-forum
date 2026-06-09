import api from './api';

export async function listarPublicaciones({ q = '', categoria = 'todas' } = {}) {
  const params = {};
  if (q) params.q = q;
  if (categoria && categoria !== 'todas') params.categoria = categoria;
  const { data } = await api.get('/publicaciones', { params });
  return data.publicaciones;
}

export async function crearPublicacion(datos) {
  const { data } = await api.post('/publicaciones', datos);
  return data.publicacion;
}

export async function toggleLike(id) {
  const { data } = await api.post(`/publicaciones/${id}/like`);
  return data.publicacion;
}

export async function eliminarPublicacion(id) {
  const { data } = await api.delete(`/publicaciones/${id}`);
  return data;
}

export async function agregarComentario(id, texto) {
  const { data } = await api.post(`/publicaciones/${id}/comentarios`, { texto });
  return data.publicacion;
}
