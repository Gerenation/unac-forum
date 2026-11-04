import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Message from '../components/ui/Message';
import { useAuth } from '../context/AuthContext';
import {
  listarPublicaciones as svcListarPublicaciones,
  eliminarPublicacion as svcEliminarPublicacion
} from '../services/publicacionService';
import {
  CATEGORIAS_DISPONIBLES,
  etiquetaCategoria,
  formatearFechaLegible,
  normalizarCategorias
} from '../constants/categorias';

/**
 * Página de moderación de publicaciones.
 * Permite a los administradores ver todas las publicaciones y eliminar cualquiera.
 *
 * Precondición: el usuario en sesión debe tener rol 'admin'.
 * Postcondición: se muestra un listado de publicaciones con botón de eliminación para cada una.
 *
 * @returns {JSX.Element} Vista de moderación de publicaciones.
 */
export default function AdminModerar() {
  const { usuario } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [eliminando, setEliminando] = useState({});
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('todas');

  const esAdmin = usuario && usuario.rol === 'admin';

  async function cargarPublicaciones() {
    setCargando(true);
    setError('');
    try {
      const params = {};
      if (q) params.q = q;
      if (categoria && categoria !== 'todas') params.categoria = categoria;
      const datos = await svcListarPublicaciones(params);
      setPublicaciones(datos || []);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cargar las publicaciones.');
      toast.error(error);
    } finally {
      setCargando(false);
    }
  }

  async function manejarEliminar(id, titulo) {
    const confirmado = window.confirm(
      `¿Eliminar la publicación "${titulo}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;
    setEliminando((prev) => ({ ...prev, [id]: true }));
    try {
      await svcEliminarPublicacion(id);
      setPublicaciones((prev) => prev.filter((p) => p.id !== id));
      toast.success('Publicación eliminada.');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'No se pudo eliminar la publicación.';
      toast.error(msg);
    } finally {
      setEliminando((prev) => {
        const siguiente = { ...prev };
        delete siguiente[id];
        return siguiente;
      });
    }
  }

  useEffect(() => {
    cargarPublicaciones();
  }, [q, categoria]);

  return (
    <>
      <Header
        subtitulo="Moderación de publicaciones"
        navLabel="Moderación"
        navLinks={[
          {
            kind: 'link',
            to: '/explorar',
            label: 'Volver al foro',
            className: 'boton-secundario'
          },
          {
            kind: 'link',
            to: '/admin/usuarios',
            label: 'Gestionar usuarios',
            className: 'boton-secundario'
          }
        ]}
      />
      <main className="contenido-admin">
        <h1>Moderación de Publicaciones</h1>
        <p className="descripcion-admin">
          Como administrador, puedes ver y eliminar cualquier publicación del foro.
        </p>

        <Message texto={error} error />

        <div className="barra-herramientas-feed" role="search" aria-label="Buscar y filtrar publicaciones">
          <div className="grupo-busqueda">
            <label htmlFor="inputBuscadorAdmin">Buscar</label>
            <input
              id="inputBuscadorAdmin"
              name="inputBuscadorAdmin"
              type="search"
              placeholder="Título, texto o autor…"
              autoComplete="off"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="grupo-filtro-categoria">
            <label htmlFor="selectCategoriaAdmin">Filtrar por categoría</label>
            <select
              id="selectCategoriaAdmin"
              name="selectCategoriaAdmin"
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

        {cargando && publicaciones.length === 0 ? (
          <p className="feed-vacio">Cargando publicaciones…</p>
        ) : (
          <>
            <p
              id="textoFeedVacioAdmin"
              className="feed-vacio"
              hidden={publicaciones.length > 0 || cargando}
            >
              No hay publicaciones que coincidan con tu búsqueda o categoría.
            </p>
            <div id="contenedorFeedAdmin" className="contenedor-feed">
              {publicaciones.map((p) => (
                <article key={p.id} className="tarjeta-post tarjeta-post-moderada">
                  <header className="tarjeta-post-encabezado">
                    <h2 className="tarjeta-post-titulo">{p.titulo}</h2>
                    <div className="tarjeta-post-meta">
                      <span className="tarjeta-post-autor">{p.nombreAutor}</span>
                      <span className="tarjeta-post-separador">·</span>
                      <time className="tarjeta-post-fecha" dateTime={p.fechaIso}>
                        {formatearFechaLegible(p.fechaIso)}
                      </time>
                    </div>
                    <div className="tarjeta-post-acciones-autor">
                      <span className="etiqueta-moderacion">Moderación</span>
                      <div className="tarjeta-post-categorias" aria-label="Categorías">
                        {normalizarCategorias(p.categorias || p.categoria).map((cat) => (
                          <span key={cat} className={`chip-categoria chip-categoria-${cat}`}>
                            {etiquetaCategoria(cat)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </header>
                  <div className="tarjeta-post-cuerpo">
                    {(p.contenido || '').split('\n').filter(Boolean).map((linea, idx) => (
                      <p key={idx}>{linea}</p>
                    ))}
                  </div>
                  <footer className="tarjeta-post-pie">
                    <div className="tarjeta-post-pie-acciones">
                      <button
                        type="button"
                        className="boton-eliminar boton-eliminar-admin"
                        onClick={() => manejarEliminar(p.id, p.titulo)}
                        disabled={eliminando[p.id]}
                        aria-label={`Eliminar publicación "${p.titulo}"`}
                      >
                        {eliminando[p.id] ? 'Eliminando…' : 'Eliminar publicación'}
                      </button>
                    </div>
                  </footer>
                </article>
              ))}
              {publicaciones.length === 0 && (
                <p className="celda-vacia">No hay publicaciones para mostrar.</p>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
