import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import {
  listarPublicaciones,
  toggleLike as svcToggleLike
} from '../services/publicacionService';
import { CATEGORIAS_DISPONIBLES, etiquetaCategoria, formatearFechaLegible } from '../constants/categorias';

function PostCard({ publicacion, onToggleLike }) {
  const lineas = (publicacion.contenido || '').split('\n');
  const parrafos = lineas.filter((l) => l !== '');
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
        <span className={`chip-categoria chip-categoria-${publicacion.categoria}`}>
          {etiquetaCategoria(publicacion.categoria)}
        </span>
      </header>
      <div className="tarjeta-post-cuerpo">
        {parrafos.length === 0 ? (
          <p className="tarjeta-post-sin-texto">(Sin descripción)</p>
        ) : (
          parrafos.map((linea, idx) => <p key={idx}>{linea}</p>)
        )}
      </div>
      <footer className="tarjeta-post-pie">
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
      </footer>
    </article>
  );
}

export default function Feed() {
  const { usuario, logout } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('todas');

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

  async function manejarLike(id) {
    try {
      const actualizada = await svcToggleLike(id);
      setPublicaciones((prev) =>
        prev.map((p) => (p.id === actualizada.id ? actualizada : p))
      );
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
    }
  }

  return (
    <>
      <Header
        subtitulo="Tablón de anuncios y temas de interés"
        navLabel="Acciones del foro"
        navLinks={[
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
            <label htmlFor="selectCategoria">Categoría</label>
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
          <p
            id="textoFeedVacio"
            className="feed-vacio"
            hidden={publicaciones.length > 0 || cargando}
          >
            No hay publicaciones que coincidan con tu búsqueda o categoría.
          </p>
          <div id="contenedorFeed" className="contenedor-feed">
            {publicaciones.map((p) => (
              <PostCard key={p.id} publicacion={p} onToggleLike={manejarLike} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
