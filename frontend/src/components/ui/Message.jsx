export default function Message({ texto, error = false, exito = false }) {
  if (!texto) return null;
  const clase = error ? 'mensaje-error' : 'mensaje-exito';
  return <p className={clase}>{texto}</p>;
}
