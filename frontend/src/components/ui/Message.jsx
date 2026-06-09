/**
 * Muestra un mensaje de retroalimentación (error o éxito) bajo formularios.
 *
 * Precondición: si `texto` está vacío, no se renderiza nada.
 * Postcondición: el usuario ve el mensaje con estilo acorde al tipo indicado.
 *
 * @param {Object} props
 * @param {string} props.texto - Contenido del mensaje.
 * @param {boolean} [props.error=false] - Si es true, aplica estilo de error.
 * @param {boolean} [props.exito=false] - Si es true, aplica estilo de éxito.
 * @returns {JSX.Element|null} Párrafo con el mensaje o null.
 */
export default function Message({ texto, error = false, exito = false }) {
  if (!texto) return null;
  const clase = error ? 'mensaje-error' : exito ? 'mensaje-exito' : 'mensaje-info';
  return <p className={clase}>{texto}</p>;
}
