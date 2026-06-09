import api from './api';

/**
 * Lista publicaciones del foro con filtros opcionales de texto y categoría.
 *
 * Precondición: el usuario debe tener sesión activa (ruta protegida en backend).
 * Postcondición: retorna publicaciones ordenadas de más reciente a más antigua.
 *
 * @param {Object} [filtros] - Criterios de búsqueda del feed.
 * @param {string} [filtros.q=''] - Texto a buscar en título, contenido o autor.
 * @param {string} [filtros.categoria='todas'] - Categoría para filtrar; `todas` omite el filtro.
 * @returns {Promise<Object[]>} Arreglo de publicaciones serializadas para la UI.
 */
export async function listarPublicaciones({ q = '', categoria = 'todas' } = {}) {
  const params = {};
  if (q) params.q = q;
  if (categoria && categoria !== 'todas') params.categoria = categoria;
  const { data } = await api.get('/publicaciones', { params });
  return data.publicaciones;
}

/**
 * Crea una nueva publicación en el foro.
 *
 * Precondición: título, contenido y al menos una categoría válida deben estar presentes.
 * Postcondición: la publicación queda persistida y se devuelve con su identificador.
 *
 * @param {Object} datos - Campos del formulario de nueva publicación.
 * @param {string} datos.titulo - Título (máx. 60 caracteres).
 * @param {string} datos.contenido - Cuerpo del anuncio.
 * @param {string[]} datos.categorias - Una o más categorías del enum permitido.
 * @returns {Promise<Object>} Publicación recién creada.
 */
export async function crearPublicacion(datos) {
  const { data } = await api.post('/publicaciones', datos);
  return data.publicacion;
}

/**
 * Alterna el like del usuario autenticado sobre una publicación.
 *
 * Precondición: la publicación con `id` debe existir.
 * Postcondición: si el usuario ya había dado like, se quita; si no, se agrega.
 *
 * @param {string} id - Identificador de la publicación.
 * @returns {Promise<Object>} Publicación actualizada con conteo de likes.
 */
export async function toggleLike(id) {
  const { data } = await api.post(`/publicaciones/${id}/like`);
  return data.publicacion;
}

/**
 * Elimina una publicación del foro (solo el autor puede hacerlo en el backend).
 *
 * Precondición: el usuario autenticado es el autor de la publicación.
 * Postcondición: la publicación deja de existir en la base de datos.
 *
 * @param {string} id - Identificador de la publicación a eliminar.
 * @returns {Promise<{mensaje: string}>} Confirmación del servidor.
 */
export async function eliminarPublicacion(id) {
  const { data } = await api.delete(`/publicaciones/${id}`);
  return data;
}

/**
 * Agrega un comentario a una publicación existente.
 *
 * Precondición: `texto` no está vacío y no supera 500 caracteres.
 * Postcondición: el comentario queda asociado a la publicación con autor y fecha.
 *
 * @param {string} id - Identificador de la publicación.
 * @param {string} texto - Contenido del comentario.
 * @returns {Promise<Object>} Publicación actualizada con la lista de comentarios.
 */
export async function agregarComentario(id, texto) {
  const { data } = await api.post(`/publicaciones/${id}/comentarios`, { texto });
  return data.publicacion;
}
