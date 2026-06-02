import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header({ subtitulo, navLinks = [], navLabel = 'Navegación' }) {
  const { usuario, logout } = useAuth();
  return (
    <header className="cabecera-sitio">
      <div className="cabecera-sitio-interior">
        <div className="marca-sitio">
          <h1 className="marca-sitio-titulo">UNAC Forum</h1>
          <p className="marca-sitio-subtitulo">{subtitulo}</p>
        </div>
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
                  onClick={link.onClick || logout}
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
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
