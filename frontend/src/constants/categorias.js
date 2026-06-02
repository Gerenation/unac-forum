export const LONGITUD_MAXIMA_TITULO = 60;

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

export function etiquetaCategoria(categoria) {
  if (!categoria) return '';
  return ETIQUETAS[categoria] || categoria;
}

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
