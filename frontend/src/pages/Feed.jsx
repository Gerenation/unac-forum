import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Message from '../components/ui/Message';
import { useAuth } from '../context/AuthContext';
import {
  listarPublicaciones,
  toggleLike as svcToggleLike,
  eliminarPublicacion,
  agregarComentario as svcAgregarComentario
} from '../services/publicacionService';
import {
  CATEGORIAS_DISPONIBLES,
  etiquetaCategoria,
  formatearFechaLegible,
  normalizarCategorias
} from '../constants/categorias';

/** Longitud máxima permitida para un comentario (sincronizado con el backend). */
const MAX_LONGITUD_COMENTARIO = 500;

/**
 * Tarjeta individual de una publicación del foro con likes, comentarios y eliminación.
 *
 * @param {Object} props
 * @param {Object} props.publicacion - Datos serializados de la publicación.
 * @param {boolean} props.esAutor - True si el usuario en sesión creó esta publicación.
 * @param {boolean} props.expandido - Si la sección de comentarios está visible.
 * @param {Function} props.onToggleExpandido - Alterna visibilidad de comentarios.
 * @param {Function} props.onToggleLike - Envía petición de like/unlike.
 * @param {Function} props.onEliminar - Elimina la publicación (solo autor).
 * @param {Function} props.onAgregarComentario - Publica un comentario nuevo.
 * @returns {JSX.Element} Artículo HTML con la publicación completa.
 */
function PostCard({
  publicacion,
  esAutor,
  expandido,
  onToggleExpandido,
  onToggleLike,
  onEliminar,
  onAgregarComentario
}) {
  const [textoComentario, setTextoComentario] = useState('');
  const [errorComentario, setErrorComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const categorias = normalizarCategorias(
    publicacion.categorias || publicacion.categoria
  );
  const lineas = (publicacion.contenido || '').split('\n');
  const parrafos = lineas.filter((l) => l !== '');

  /**
   * Pide confirmación y elimina la publicación si el usuario acepta.
   *
   * Precondición: `esAutor` debe ser true (el botón solo se muestra al autor).
   */
  function manejarEliminar() {
    const confirmado = window.confirm(
      `¿Eliminar la publicación "${publicacion.titulo}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;
    setEliminando(true);
    onEliminar(publicacion.id).finally(() => setEliminando(false));
  }

  /**
   * Valida y envía un comentario a la publicación.
   *
   * @param {import('react').FormEvent} e - Evento submit del formulario.
   */
  async function manejarEnvioComentario(e) {
    e.preventDefault();
    setErrorComentario('');
    const limpio = textoComentario.trim();
    if (!limpio) {
      setErrorComentario('Escribe un comentario antes de publicar.');
      return;
    }
    if (limpio.length > MAX_LONGITUD_COMENTARIO) {
      setErrorComentario(
        `El comentario no puede superar ${MAX_LONGITUD_COMENTARIO} caracteres.`
      );
      return;
    }
    setEnviandoComentario(true);
    try {
      await onAgregarComentario(publicacion.id, limpio);
      setTextoComentario('');
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje || 'No se pudo publicar el comentario.';
      setErrorComentario(mensaje);
    } finally {
      setEnviandoComentario(false);
    }
  }

  return (
    <article className="tarjeta-post" data-id-publicacion={publicacion.id}>
      <header className="tarjeta-post-encabezado">
        <h2 className="tarjeta-post-titulo">{publicacion.titulo}</h2>
        <div className="tarjeta-post-meta">
          <span className="tarjeta-post-autor">{publicacion.nombreAutor}</span>
          <span className="tarjeta-post-separador">·</span>
          <time className="tarjeta-post-fecha" dateTime={publicacion.fechaIso}>
            {formatearFechaLegible(publicacion.fechaIso)}
          </time>
        </div>
        <div className="tarjeta-post-acciones-autor">
          {esAutor && (
            <button
              type="button"
              className="boton-eliminar"
              onClick={manejarEliminar}
              disabled={eliminando}
              aria-label="Eliminar publicación"
            >
              {eliminando ? 'Eliminando…' : 'Eliminar'}
            </button>
          )}
          <div className="tarjeta-post-categorias" aria-label="Categorías de la publicación">
            {categorias.map((cat) => (
              <span key={cat} className={`chip-categoria chip-categoria-${cat}`}>
                {etiquetaCategoria(cat)}
              </span>
            ))}
          </div>
        </div>
      </header>
      <div className="tarjeta-post-cuerpo">
        {parrafos.length === 0 ? (
          <p className="tarjeta-post-sin-texto">(Sin descripción)</p>
        ) : (
          parrafos.map((linea, idx) => <p key={idx}>{linea}</p>)
        )}
      </div>
      <footer className="tarjeta-post-pie">
        <div className="tarjeta-post-pie-acciones">
          <button
            type="button"
            className={`boton-like${publicacion.usuarioYaDioLike ? ' boton-like-activo' : ''}`}
            data-id-publicacion={publicacion.id}
            aria-pressed={publicacion.usuarioYaDioLike ? 'true' : 'false'}
            aria-label={publicacion.usuarioYaDioLike ? 'Quitar me gusta' : 'Dar me gusta'}
            onClick={() => onToggleLike(publicacion.id)}
          >
            <span className="boton-like-icono" aria-hidden="true">♥</span>
            <span className="boton-like-contador">{publicacion.cantidadLikes}</span>
          </button>
          <button
            type="button"
            className={`boton-toggle-comentarios${expandido ? ' boton-toggle-comentarios-activo' : ''}`}
            onClick={() => onToggleExpandido(publicacion.id)}
            aria-expanded={expandido}
            aria-controls={`comentarios-${publicacion.id}`}
          >
            <span aria-hidden="true">💬</span>
            <span>
              {publicacion.cantidadComentarios > 0
                ? `Comentarios (${publicacion.cantidadComentarios})`
                : 'Comentar'}
            </span>
          </button>
        </div>
      </footer>
      {expandido && (
        <section
          id={`comentarios-${publicacion.id}`}
          className="seccion-comentarios"
        >
          <h3>Comentarios</h3>
          {publicacion.comentarios && publicacion.comentarios.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {publicacion.comentarios.map((c, idx) => (
                <li key={idx} className="comentario-item">
                  <span className="comentario-autor">{c.nombreAutor}</span>
                  <span className="comentario-meta">
                    {formatearFechaLegible(c.fechaIso)}
                  </span>
                  <p className="comentario-texto">{c.texto}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="comentarios-vacio">Sé el primero en comentar.</p>
          )}
          <form className="formulario-comentario" onSubmit={manejarEnvioComentario}>
            <textarea
              value={textoComentario}
              onChange={(e) => setTextoComentario(e.target.value)}
              maxLength={MAX_LONGITUD_COMENTARIO}
              placeholder="Escribe tu comentario…"
              aria-label="Escribe tu comentario"
              disabled={enviandoComentario}
            />
            {errorComentario && (
              <p className="mensaje-comentario-error">{errorComentario}</p>
            )}
            <button
              type="submit"
              className="boton-primario"
              disabled={enviandoComentario}
            >
              {enviandoComentario ? 'Publicando…' : 'Publicar comentario'}
            </button>
          </form>
        </section>
      )}
    </article>
  );
}

/**
 * Página principal del foro: feed con búsqueda, filtro por categoría, likes y comentarios.
 *
 * Funcionalidades cubiertas: filtrar foros, dar like, comentar, eliminar foro (si es autor).
 *
 * Precondición: el usuario debe estar autenticado (ruta protegida).
 * Postcondición: muestra publicaciones acordes a los filtros activos.
 *
 * @returns {JSX.Element} Vista completa del tablón de anuncios.
 */
export default function Feed() {
  const { usuario, logout } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [idExpandido, setIdExpandido] = useState(null);

  /**
   * Obtiene publicaciones del API aplicando filtros de texto y categoría.
   *
   * @param {{q?: string, categoria?: string}} filtros - Criterios de búsqueda.
   * @returns {Promise<void>}
   */
  async function cargar(filtros) {
    setCargando(true);
    setError('');
    try {
      const datos = await listarPublicaciones(filtros);
      setPublicaciones(datos);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cargar el feed.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar({ q, categoria });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, categoria]);

  /**
   * Alterna el like del usuario sobre una publicación y actualiza el estado local.
   *
   * @param {string} id - ID de la publicación.
   */
  async function manejarLike(id) {
    try {
      const actualizada = await svcToggleLike(id);
      setPublicaciones((prev) =>
        prev.map((p) => (p.id === actualizada.id ? actualizada : p))
      );
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        toast.error(err.response?.data?.mensaje || 'No se pudo actualizar el like.');
      }
    }
  }

  /**
   * Elimina una publicación del feed tras confirmación del usuario.
   *
   * @param {string} id - ID de la publicación a eliminar.
   */
  async function manejarEliminar(id) {
    try {
      await eliminarPublicacion(id);
      setPublicaciones((prev) => {
        const siguiente = prev.filter((p) => p.id !== id);
        if (idExpandido === id) setIdExpandido(null);
        return siguiente;
      });
      toast.success('Publicación eliminada.');
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        toast.error(err.response?.data?.mensaje || 'No se pudo eliminar la publicación.');
      }
      throw err;
    }
  }

  /**
   * Publica un comentario y refresca la tarjeta correspondiente en el estado.
   *
   * @param {string} id - ID de la publicación.
   * @param {string} texto - Texto del comentario.
   */
  async function manejarAgregarComentario(id, texto) {
    const actualizada = await svcAgregarComentario(id, texto);
    setPublicaciones((prev) =>
      prev.map((p) => (p.id === actualizada.id ? actualizada : p))
    );
    toast.success('Comentario publicado.');
  }

  /**
   * Expande o contrae el panel de comentarios de una publicación.
   *
   * @param {string} id - ID de la publicación.
   */
  function alternarExpandido(id) {
    setIdExpandido((actual) => (actual === id ? null : id));
  }

  return (
    <>
      <Header
        subtitulo="Tablón de anuncios y temas de interés"
        navLabel="Acciones del foro"
        navLinks={[
          {
            kind: 'link',
            to: '/perfil',
            label: 'Mi perfil',
            className: 'boton-secundario'
          },
          {
            kind: 'link',
            to: '/nueva-publicacion',
            label: 'Nueva publicación',
            className: 'boton-primario'
          }
        ]}
      />
      <main>
        <div
          className="barra-herramientas-feed"
          role="search"
          aria-label="Buscar y filtrar publicaciones"
        >
          <div className="grupo-busqueda">
            <label htmlFor="inputBuscador">Buscar</label>
            <input
              id="inputBuscador"
              name="inputBuscador"
              type="search"
              placeholder="Título, texto o autor…"
              autoComplete="off"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="grupo-filtro-categoria">
            <label htmlFor="selectCategoria">Filtrar por categoría</label>
            <select
              id="selectCategoria"
              name="selectCategoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="todas">Todas</option>
              {CATEGORIAS_DISPONIBLES.map((cat) => (
                <option key={cat} value={cat}>
                  {etiquetaCategoria(cat)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="contenedor-feed-principal">
          <Message texto={error} error />
          {cargando && publicaciones.length === 0 ? (
            <p className="feed-vacio">Cargando publicaciones…</p>
          ) : (
            <p
              id="textoFeedVacio"
              className="feed-vacio"
              hidden={publicaciones.length > 0 || cargando}
            >
              No hay publicaciones que coincidan con tu búsqueda o categoría.
            </p>
          )}
          <div id="contenedorFeed" className="contenedor-feed">
            {publicaciones.map((p) => (
              <PostCard
                key={p.id}
                publicacion={p}
                esAutor={usuario ? p.idAutor === usuario.id : false}
                expandido={idExpandido === p.id}
                onToggleExpandido={alternarExpandido}
                onToggleLike={manejarLike}
                onEliminar={manejarEliminar}
                onAgregarComentario={manejarAgregarComentario}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
