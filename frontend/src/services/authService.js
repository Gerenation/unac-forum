import api from './api';

/**
 * Registra un nuevo usuario en el foro.
 *
 * Precondición: `datos` incluye nombreCompleto, nombreUsuario, correo y contrasena (mín. 6 caracteres).
 * Postcondición: el backend crea el usuario y devuelve token JWT + perfil público.
 *
 * @param {Object} datos - Campos del formulario de registro.
 * @param {string} datos.nombreCompleto - Nombre y apellidos del estudiante.
 * @param {string} datos.nombreUsuario - Alias único en el foro.
 * @param {string} datos.correo - Correo institucional o de contacto.
 * @param {string} datos.contrasena - Contraseña en texto plano (se hashea en el servidor).
 * @returns {Promise<{token: string, usuario: Object}>} Credenciales de sesión recién creadas.
 */
export async function registrarUsuario(datos) {
  const { data } = await api.post('/auth/registro', datos);
  return data;
}

/**
 * Inicia sesión con correo y contraseña.
 *
 * Precondición: el usuario ya existe y las credenciales son correctas.
 * Postcondición: retorna token JWT válido por 30 días y datos públicos del usuario.
 *
 * @param {Object} credenciales - Par correo/contraseña del formulario de login.
 * @param {string} credenciales.correo - Correo registrado.
 * @param {string} credenciales.contrasena - Contraseña del usuario.
 * @returns {Promise<{token: string, usuario: Object}>} Sesión autenticada.
 */
export async function loginUsuario(credenciales) {
  const { data } = await api.post('/auth/login', credenciales);
  return data;
}

/**
 * Obtiene el perfil del usuario autenticado según el token actual.
 *
 * Precondición: existe un token JWT válido en localStorage o en el header de la petición.
 * Postcondición: retorna el perfil actualizado desde la base de datos.
 *
 * @returns {Promise<{usuario: Object}>} Datos públicos del usuario en sesión.
 */
export async function obtenerPerfil() {
  const { data } = await api.get('/auth/perfil');
  return data;
}

/**
 * Actualiza campos del perfil del usuario autenticado.
 *
 * Precondición: al menos un campo cambió; si se cambia contraseña, `contrasenaActual` es obligatoria.
 * Postcondición: el perfil queda persistido en MongoDB con los nuevos valores.
 *
 * @param {Object} datos - Campos opcionales a modificar.
 * @param {string} [datos.nombreCompleto] - Nuevo nombre completo.
 * @param {string} [datos.nombreUsuario] - Nuevo alias.
 * @param {string} [datos.correo] - Nuevo correo.
 * @param {string} [datos.contrasenaActual] - Contraseña vigente (requerida al cambiar contraseña).
 * @param {string} [datos.contrasenaNueva] - Nueva contraseña (mín. 6 caracteres).
 * @returns {Promise<{usuario: Object}>} Perfil actualizado.
 */
export async function actualizarPerfil(datos) {
  const { data } = await api.post('/auth/perfil', datos);
  return data;
}
