import axios from 'axios';

/**
 * Cliente HTTP centralizado para comunicarse con la API REST del backend.
 * Inyecta el token JWT en cada petición y gestiona cierre de sesión ante errores 401.
 */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

/**
 * Interceptor de peticiones: adjunta el token de sesión si existe en localStorage.
 *
 * Precondición: la clave `unac_forum_token` puede o no estar presente.
 * Postcondición: el header Authorization queda configurado cuando hay token válido almacenado.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('unac_forum_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor de respuestas: ante 401 limpia la sesión local y redirige al login.
 *
 * Precondición: el servidor respondió con estado HTTP 401 (token ausente, inválido o expirado).
 * Postcondición: localStorage queda sin credenciales y el usuario es enviado a `/login`.
 */
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('unac_forum_token');
      localStorage.removeItem('unac_forum_usuario');
      if (!['/login', '/registro', '/'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
