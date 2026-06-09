/**
 * Constantes y utilidades compartidas para las categorías del foro.
 * Mantienen sincronía con el enum del backend (`Publicacion.js`).
 */

export const LONGITUD_MAXIMA_TITULO = 60;

/** Máximo de categorías que puede llevar una publicación (igual que en el backend). */
export const MAX_CATEGORIAS_POR_PUBLICACION = 5;

export const CATEGORIAS_DISPONIBLES = [
  'convocatoria',
  'evento',
  'alertaAcademica',
  'bienestar',
  'tecnologia',
  'deportes',
  'cultura',
  'general',
  'socializacion'
];

const ETIQUETAS = {
  convocatoria: 'Convocatoria',
  evento: 'Evento',
  alertaAcademica: 'Alerta académica',
  bienestar: 'Bienestar',
  tecnologia: 'Tecnología',
  deportes: 'Deportes',
  cultura: 'Cultura',
  general: 'General',
  socializacion: 'Socialización'
};

/**
 * Devuelve la etiqueta legible de una categoría interna.
 *
 * Precondición: `categoria` es un identificador definido en `CATEGORIAS_DISPONIBLES` o cadena vacía.
 * Postcondición: retorna texto en español listo para mostrar en la interfaz.
 *
 * @param {string} categoria - Identificador interno de la categoría.
 * @returns {string} Nombre visible de la categoría.
 */
export function etiquetaCategoria(categoria) {
  if (!categoria) return '';
  return ETIQUETAS[categoria] || categoria;
}

/**
 * Une varias categorías en una sola cadena separada por comas.
 *
 * @param {string[]} categorias - Lista de identificadores de categoría.
 * @returns {string} Etiquetas legibles unidas.
 */
export function etiquetasCategorias(categorias) {
  return normalizarCategorias(categorias)
    .map((c) => etiquetaCategoria(c))
    .join(', ');
}

/**
 * Normaliza categorías desde API nueva (array) o respuesta legacy (string único).
 *
 * Precondición: `valor` puede ser array, string o undefined.
 * Postcondición: retorna solo categorías válidas, sin duplicados, en orden de aparición.
 *
 * @param {string[]|string|undefined} valor - Categorías en cualquier formato admitido.
 * @returns {string[]} Arreglo limpio de categorías válidas.
 */
export function normalizarCategorias(valor) {
  let lista = [];
  if (Array.isArray(valor)) {
    lista = valor;
  } else if (typeof valor === 'string' && valor.trim()) {
    lista = [valor.trim()];
  }
  const vistas = new Set();
  const resultado = [];
  for (const item of lista) {
    const clave = String(item).trim();
    if (CATEGORIAS_DISPONIBLES.includes(clave) && !vistas.has(clave)) {
      vistas.add(clave);
      resultado.push(clave);
    }
  }
  return resultado;
}

/**
 * Formatea una fecha ISO en texto legible para Colombia.
 *
 * @param {string} fechaIso - Fecha en formato ISO 8601.
 * @returns {string} Fecha corta localizada o cadena vacía si es inválida.
 */
export function formatearFechaLegible(fechaIso) {
  if (!fechaIso) return '';
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return '';
  return fecha.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
