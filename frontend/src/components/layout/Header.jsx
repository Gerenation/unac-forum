import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SiteBrand from './SiteBrand';

/**
 * Cabecera reutilizable de las vistas autenticadas del foro.
 * Muestra logo UNAC, subtítulo, nombre del usuario y acciones de navegación.
 *
 * Precondición: debe usarse en rutas donde ya existe sesión (o el nombre puede quedar vacío).
 * Postcondición: al cerrar sesión el usuario es enviado a la pantalla de login.
 *
 * @param {Object} props
 * @param {string} props.subtitulo - Descripción contextual de la vista actual.
 * @param {Array<Object>} [props.navLinks=[]] - Enlaces o botones adicionales del menú.
 * @param {string} [props.navLabel='Navegación'] - Etiqueta accesible del bloque nav.
 * @returns {JSX.Element} Cabecera superior del sitio.
 */
export default function Header({ subtitulo, navLinks = [], navLabel = 'Navegación' }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Cierra la sesión local y redirige al formulario de inicio de sesión.
   *
   * Postcondición: token y usuario eliminados de localStorage; ruta actual es `/login`.
   */
  function manejarCerrarSesion() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="cabecera-sitio">
      <div className="cabecera-sitio-interior">
        <SiteBrand subtitulo={subtitulo} />
        <div className="barra-usuario-cabecera">
          {subtitulo === 'Tablón de anuncios y temas de interés' ? (
            <span className="texto-usuario-activo">
              Hola, <strong>{usuario?.nombreCompleto}</strong>
            </span>
          ) : (
            <span className="texto-usuario-activo">
              <strong>{usuario?.nombreCompleto}</strong>
            </span>
          )}
          <nav className="nav-cabecera-feed" aria-label={navLabel}>
            {navLinks.map((link, idx) =>
              link.kind === 'button' ? (
                <button
                  key={idx}
                  type="button"
                  className={link.className || 'boton-secundario'}
                  onClick={link.onClick || manejarCerrarSesion}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={idx}
                  to={link.to}
                  className={link.className || 'boton-primario'}
                >
                  {link.label}
                </Link>
              )
            )}
            <button
              type="button"
              className="boton-secundario"
              onClick={manejarCerrarSesion}
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
