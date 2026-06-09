import api from './api';

export async function registrarUsuario(datos) {
  const { data } = await api.post('/auth/registro', datos);
  return data;
}

export async function loginUsuario(credenciales) {
  const { data } = await api.post('/auth/login', credenciales);
  return data;
}

export async function obtenerPerfil() {
  const { data } = await api.get('/auth/perfil');
  return data;
}

export async function actualizarPerfil(datos) {
  const { data } = await api.post('/auth/perfil', datos);
  return data;
}
