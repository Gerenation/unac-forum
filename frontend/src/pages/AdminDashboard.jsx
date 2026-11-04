import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Message from '../components/ui/Message';
import {
  listarUsuarios as svcListarUsuarios,
  cambiarRolUsuario as svcCambiarRol,
  banearUsuario as svcBanearUsuario,
  desbanearUsuario as svcDesbanearUsuario
} from '../services/authService';
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
 * Panel de administración unificado del foro UNAC.
 *
 * Diseño diferenciado del foro normal: barra lateral de navegación,
 * tarjetas de estadísticas, tabla de usuarios con información completa
 * (incluyendo baneo temporal) y lista de publicaciones para moderación
 * (incluyendo comentarios).
 *
 * Precondición: el usuario en sesión debe tener rol 'admin'.
 * Postcondición: el administrador puede gestionar usuarios (roles y baneo)
 * y moderar publicaciones (ver comentarios y eliminar) desde una sola vista.
 *
 * @returns {JSX.Element} Panel de administración completo.
 */
export default function AdminDashboard() {
  const { usuario, logout } = useAuth();

  const [vistaActiva, setVistaActiva] = useState('resumen');
  const [usuarios, setUsuarios] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [cargandoPublicaciones, setCargandoPublicaciones] = useState(true);
  const [error, setError] = useState('');
  const [cambiandoRol, setCambiandoRol] = useState({});
  const [baneando, setBaneando] = useState({});
  const [eliminando, setEliminando] = useState({});
  const [qPosts, setQPosts] = useState('');
  const [categoriaPosts, setCategoriaPosts] = useState('todas');

  const esAdmin = usuario && usuario.rol === 'admin';

  // ------------------------------------------------------------------
  // Carga de usuarios
  // ------------------------------------------------------------------
  async function cargarUsuarios() {
    setCargandoUsuarios(true);
    setError('');
    try {
      const data = await svcListarUsuarios();
      setUsuarios(data.usuarios || []);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cargar la lista de usuarios.');
      toast.error(error);
    } finally {
      setCargandoUsuarios(false);
    }
  }

  async function manejarCambioRol(id, nuevoRol) {
    setCambiandoRol((prev) => ({ ...prev, [id]: true }));
    try {
      await svcCambiarRol(id, nuevoRol);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
      );
      toast.success(`Rol de ${nuevoRol === 'admin' ? 'administrador' : 'usuario'} asignado.`);
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'No se pudo cambiar el rol.';
      toast.error(msg);
    } finally {
      setCambiandoRol((prev) => {
        const siguiente = { ...prev };
        delete siguiente[id];
        return siguiente;
      });
    }
  }

  async function manejarBanear(id, razon) {
    setBaneando((prev) => ({ ...prev, [id]: true }));
    try {
      await svcBanearUsuario(id, razon);
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, baneado: true, fechaBaneo: new Date().toISOString(), razonBaneo: razon }
            : u
        )
      );
      toast.success('Usuario baneado exitosamente.');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'No se pudo banear al usuario.';
      toast.error(msg);
    } finally {
      setBaneando((prev) => {
        const siguiente = { ...prev };
        delete siguiente[id];
        return siguiente;
      });
    }
  }

  async function manejarDesbanear(id) {
    setBaneando((prev) => ({ ...prev, [id]: true }));
    try {
      await svcDesbanearUsuario(id);
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, baneado: false, fechaBaneo: null, razonBaneo: null }
            : u
        )
      );
      toast.success('Usuario desbaneado exitosamente.');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'No se pudo desbanear al usuario.';
      toast.error(msg);
    } finally {
      setBaneando((prev) => {
        const siguiente = { ...prev };
        delete siguiente[id];
        return siguiente;
      });
    }
  }

  // ------------------------------------------------------------------
  // Carga de publicaciones
  // ------------------------------------------------------------------
  async function cargarPublicaciones() {
    setCargandoPublicaciones(true);
    setError('');
    try {
      const params = {};
      if (qPosts) params.q = qPosts;
      if (categoriaPosts && categoriaPosts !== 'todas') params.categoria = categoriaPosts;
      const datos = await svcListarPublicaciones(params);
      setPublicaciones(datos || []);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cargar las publicaciones.');
      toast.error(error);
    } finally {
      setCargandoPublicaciones(false);
    }
  }

  async function manejarEliminarPost(id, titulo) {
    const confirmado = window.confirm(
      `¿Eliminar la publicación "${titulo}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;
    setEliminando((prev) => ({ ...prev, [id]: true }));
    try {
      await svcEliminarPublicacion(id);
      setPublicaciones((prev) => prev.filter((p) => p.id !== id));
      toast.success('Publicación eliminada del foro.');
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

  // ------------------------------------------------------------------
  // Estadísticas
  // ------------------------------------------------------------------
  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter((u) => u.rol === 'admin').length;
  const totalUsuariosComunes = usuarios.filter((u) => u.rol === 'usuario').length;
  const totalUsuariosBaneados = usuarios.filter((u) => u.baneado).length;
  const totalPublicaciones = publicaciones.length;
  const totalLikes = publicaciones.reduce((acc, p) => acc + (p.cantidadLikes || 0), 0);
  const totalComentarios = publicaciones.reduce(
    (acc, p) => acc + (p.cantidadComentarios || 0),
    0
  );

  useEffect(() => {
    if (!esAdmin) {
      toast.error('No tienes permisos de administrador.');
      return;
    }
    cargarUsuarios();
    cargarPublicaciones();
  }, [esAdmin]);

  const manejarCerrarSesion = () => {
    logout();
  };

  return (
    <div className="admin-dashboard">
      {/* Barra lateral */}
      <aside className="admin-sidebar">
        <div className="admin-marca">
          <div className="admin-logo">U</div>
          <div className="admin-titulo-marca">
            <strong>UNAC Admin</strong>
            <span className="admin-subtitulo">Panel de control</span>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Navegación de administración">
          <button
            className={`admin-nav-item ${vistaActiva === 'resumen' ? 'admin-nav-item-activo' : ''}`}
            onClick={() => setVistaActiva('resumen')}
            aria-pressed={vistaActiva === 'resumen'}
          >
            <span className="icon-resumen" aria-hidden="true">R</span>
            Resumen
          </button>
          <button
            className={`admin-nav-item ${vistaActiva === 'usuarios' ? 'admin-nav-item-activo' : ''}`}
            onClick={() => setVistaActiva('usuarios')}
            aria-pressed={vistaActiva === 'usuarios'}
          >
            <span className="icon-usuarios" aria-hidden="true">U</span>
            Usuarios
          </button>
          <button
            className={`admin-nav-item ${vistaActiva === 'moderar' ? 'admin-nav-item-activo' : ''}`}
            onClick={() => setVistaActiva('moderar')}
            aria-pressed={vistaActiva === 'moderar'}
          >
            <span className="icon-moderar" aria-hidden="true">M</span>
            Moderar publicaciones
          </button>
        </nav>

        <div className="admin-usuario-actual">
          <div className="admin-usuario-info">
            <div className="admin-usuario-nombre">{usuario?.nombreCompleto}</div>
            <div className={`admin-usuario-rol-badge rol-${usuario?.rol}`}>
              {usuario?.rol === 'admin' ? 'Administrador' : 'Usuario'}
            </div>
          </div>
          <button
            className="admin-boton-cerrar"
            onClick={manejarCerrarSesion}
            title="Cerrar sesión"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="admin-contenido">
        <header className="admin-header">
          <h1 className="admin-titulo-pagina">
            {vistaActiva === 'resumen' && 'Panel de Control'}
            {vistaActiva === 'usuarios' && 'Gestión de Usuarios'}
            {vistaActiva === 'moderar' && 'Moderación de Publicaciones'}
          </h1>
          <p className="admin-subtitulo-pagina">
            Bienvenido de nuevo, {usuario?.nombreCompleto}.
          </p>
        </header>

        <Message texto={error} error />

        {/* ===================== RESUMEN ===================== */}
        {vistaActiva === 'resumen' && (
          <section className="admin-resumen">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-valor">{totalUsuarios}</div>
                <div className="admin-stat-etiqueta">Usuarios registrados</div>
              </div>
              <div className="admin-stat-card admin-stat-card-admins">
                <div className="admin-stat-valor">{totalAdmins}</div>
                <div className="admin-stat-etiqueta">Administradores</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-valor">{totalUsuariosComunes}</div>
                <div className="admin-stat-etiqueta">Usuarios comunes</div>
              </div>
              <div className="admin-stat-card admin-stat-card-baneados">
                <div className="admin-stat-valor">{totalUsuariosBaneados}</div>
                <div className="admin-stat-etiqueta">Usuarios baneados</div>
              </div>
              <div className="admin-stat-card admin-stat-card-posts">
                <div className="admin-stat-valor">{totalPublicaciones}</div>
                <div className="admin-stat-etiqueta">Publicaciones totales</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-valor">{totalLikes}</div>
                <div className="admin-stat-etiqueta">Likes en el foro</div>
              </div>
              <div className="admin-stat-card admin-stat-card-comentarios">
                <div className="admin-stat-valor">{totalComentarios}</div>
                <div className="admin-stat-etiqueta">Comentarios totales</div>
              </div>
            </div>

            <div className="admin-acciones-rapidas">
              <h2>Acciones rápidas</h2>
              <div className="admin-botones-rapidos">
                <button
                  className="admin-boton-rapido admin-boton-rapido-usuarios"
                  onClick={() => setVistaActiva('usuarios')}
                >
                  <span className="icon-usuarios-rapido" aria-hidden="true">U</span>
                  Gestionar usuarios
                </button>
                <button
                  className="admin-boton-rapido admin-boton-rapido-moderar"
                  onClick={() => setVistaActiva('moderar')}
                >
                  <span className="icon-moderar-rapido" aria-hidden="true">M</span>
                  Moderar publicaciones
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ===================== USUARIOS ===================== */}
        {vistaActiva === 'usuarios' && (
          <section className="admin-seccion-usuarios">
            <div className="admin-barra-acciones">
              <h2>Usuarios registrados</h2>
              <p className="admin-descripcion-seccion">
                Gestiona todos los usuarios del foro: roles, baneo temporal y estado.
              </p>
            </div>

            <div className="admin-tabla-envoltura">
              <table className="admin-tabla-usuarios">
                <thead>
                  <tr>
                    <th>Nombre completo</th>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Registrado</th>
                    <th>Cambiar rol</th>
                    <th>Baneo</th>
                  </tr>
                </thead>
                <tbody>
                  {cargandoUsuarios && usuarios.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="admin-celda-cargando">
                        Cargando usuarios…
                      </td>
                    </tr>
                  ) : usuarios.length > 0 ? (
                    usuarios.map((u) => {
                      const estaBaneado = u.baneado === true;
                      return (
                        <tr key={u.id}>
                          <td>{u.nombreCompleto}</td>
                          <td>
                            <span className="admin-usuario-nombre-tabla">{u.nombreUsuario}</span>
                          </td>
                          <td>{u.correo}</td>
                          <td>
                            <span
                              className={`admin-badge-rol admin-badge-rol-${u.rol}`}
                              title={`Rol: ${u.rol}`}
                            >
                              {u.rol === 'admin' ? 'Administrador' : 'Usuario común'}
                            </span>
                          </td>
                          <td>
                            {estaBaneado ? (
                              <span className="admin-estado-baneado">Baneado</span>
                            ) : (
                              <span className="admin-estado-activo">Activo</span>
                            )}
                          </td>
                          <td>
                            <time title={u.creadoEn}>
                              {formatearFechaLegible(u.creadoEn)}
                            </time>
                          </td>
                          <td>
                            <select
                              value={u.rol}
                              onChange={(e) => manejarCambioRol(u.id, e.target.value)}
                              disabled={cambiandoRol[u.id] || baneando[u.id]}
                              className="admin-select-rol"
                            >
                              <option value="usuario">Usuario común</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </td>
                          <td>
                            {u.id === usuario.id ? (
                              <span className="admin-texto-protegido">Tu cuenta</span>
                            ) : estaBaneado ? (
                              <>
                                <button
                                  type="button"
                                  className="admin-boton-desbanear"
                                  onClick={() => manejarDesbanear(u.id)}
                                  disabled={baneando[u.id]}
                                  title="Desbanear usuario"
                                >
                                  {baneando[u.id] ? 'Procesando…' : 'Desbanear'}
                                </button>
                                <p className="admin-razon-baneo">
                                  Razón: {u.razonBaneo || 'No especificada'}
                                </p>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="admin-boton-banear"
                                  onClick={() => {
                                    const razon = window.prompt(
                                      'Ingresa la razón del baneo:'
                                    );
                                    if (razon && razon.trim()) {
                                      manejarBanear(u.id, razon.trim());
                                    }
                                  }}
                                  title="Banear usuario temporalmente"
                                >
                                  Banear
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="admin-celda-vacia">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="admin-nota">
              <strong>Nota:</strong> no puedes quitarte tu propio rol de administrador ni banearte a ti mismo desde este panel.
            </p>
          </section>
        )}

        {/* ===================== MODERAR ===================== */}
        {vistaActiva === 'moderar' && (
          <section className="admin-seccion-moderar">
            <div className="admin-barra-acciones">
              <h2>Moderación de publicaciones</h2>
              <p className="admin-descripcion-seccion">
                Revisa publicaciones completas con sus comentarios y elimina cualquier contenido inadecuado.
              </p>
            </div>

            <div className="admin-filtros-posts">
              <div className="admin-grupo-busqueda">
                <label htmlFor="admin-input-buscar">Buscar</label>
                <input
                  id="admin-input-buscar"
                  type="search"
                  placeholder="Título, texto o autor…"
                  autoComplete="off"
                  value={qPosts}
                  onChange={(e) => setQPosts(e.target.value)}
                />
              </div>
              <div className="admin-grupo-filtro">
                <label htmlFor="admin-select-categoria">Categoría</label>
                <select
                  id="admin-select-categoria"
                  value={categoriaPosts}
                  onChange={(e) => setCategoriaPosts(e.target.value)}
                >
                  <option value="todas">Todas las categorías</option>
                  {CATEGORIAS_DISPONIBLES.map((cat) => (
                    <option key={cat} value={cat}>
                      {etiquetaCategoria(cat)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-lista-posts">
              {cargandoPublicaciones && publicaciones.length === 0 ? (
                <p className="admin-celda-cargando">Cargando publicaciones…</p>
              ) : publicaciones.length > 0 ? (
                publicaciones.map((p) => (
                  <article key={p.id} className="admin-tarjeta-post">
                    <header className="admin-tarjeta-encabezado">
                      <h3 className="admin-tarjeta-titulo">{p.titulo}</h3>
                      <span
                        className={`admin-badge-categoria admin-badge-categoria-${normalizarCategorias(p.categorias || p.categoria)[0] || 'general'}`}
                      >
                        {etiquetaCategoria(normalizarCategorias(p.categorias || p.categoria)[0] || 'general')}
                      </span>
                    </header>
                    <div className="admin-tarjeta-meta">
                      <span className="admin-tarjeta-autor">{p.nombreAutor}</span>
                      <span className="admin-tarjeta-separador">·</span>
                      <time className="admin-tarjeta-fecha" dateTime={p.fechaIso}>
                        {formatearFechaLegible(p.fechaIso)}
                      </time>
                      <span className="admin-tarjeta-separador">·</span>
                      <span className="admin-tarjeta-stats">
                        Likes {p.cantidadLikes} · Comentarios {p.cantidadComentarios}
                      </span>
                    </div>
                    <div className="admin-tarjeta-contenido">
                      {(p.contenido || '').split('\n').filter(Boolean).map((linea, idx) => (
                        <p key={idx}>{linea}</p>
                      ))}
                    </div>

                    {/* Comentarios de la publicación */}
                    {p.comentarios && p.comentarios.length > 0 && (
                      <div className="admin-comentarios-seccion">
                        <h4 className="admin-comentarios-titulo">
                          Comentarios ({p.comentarios.length})
                        </h4>
                        <ul className="admin-comentarios-lista">
                          {p.comentarios.map((c, idx) => (
                            <li key={idx} className="admin-comentario-item">
                              <span className="admin-comentario-autor">{c.nombreAutor}</span>
                              <span className="admin-comentario-fecha">
                                {formatearFechaLegible(c.fechaIso)}
                              </span>
                              <p className="admin-comentario-texto">{c.texto}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <footer className="admin-tarjeta-pie">
                      <button
                        type="button"
                        className="admin-boton-eliminar"
                        onClick={() => manejarEliminarPost(p.id, p.titulo)}
                        disabled={eliminando[p.id]}
                        aria-label={`Eliminar "${p.titulo}"`}
                      >
                        {eliminando[p.id] ? 'Eliminando…' : 'Eliminar publicación'}
                      </button>
                    </footer>
                  </article>
                ))
              ) : (
                <p className="admin-celda-vacia">
                  No hay publicaciones que coincidan con tu búsqueda o categoría.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
