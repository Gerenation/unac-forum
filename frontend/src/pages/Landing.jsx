import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';
import SiteBrand from '../components/layout/SiteBrand';
import Fondo from '../assets/Fondo.png';
import Friends from '../assets/Friends.png';

/**
 * Página de bienvenida pública del foro UNAC (sin autenticación requerida).
 *
 * Funcionalidad secundaria: presentar el proyecto y dirigir al login.
 *
 * Precondición: ninguna (ruta pública).
 * Postcondición: el usuario puede navegar al formulario de inicio de sesión.
 *
 * @returns {JSX.Element} Landing page con presentación y botón de acceso.
 */
export default function Landing() {
  const navigate = useNavigate();

  /**
   * Redirige al formulario de inicio de sesión.
   *
   * Postcondición: la ruta activa pasa a ser `/login`.
   */
  function entrarAlForo() {
    navigate('/login');
  }

  return (
    <div
      className="landing-page-bg"
      style={{
        backgroundImage: `linear-gradient(rgba(11, 15, 25, 0.88), rgba(11, 15, 25, 0.95)), url(${Fondo})`
      }}
    >
      <header className="landing-navbar cabecera-sitio landing-cabecera">
        <div className="cabecera-sitio-interior landing-cabecera-interior">
          <SiteBrand subtitulo="Comunidad universitaria UNAC" />
        </div>
      </header>

      <main className="landing-main-content">
        <div className="landing-hero-section">
          <div className="landing-hero-text-side">
            <h1 className="landing-hero-title">
              CONÉCTATE,
              <br />
              COMPARTE Y
              <br />
              CRECE CON
              <br />
              LA UNAC.
            </h1>
            <p className="landing-hero-subtitle">
              UNAC Forum: el punto de encuentro oficial para parches, anuncios y
              bienestar de tu comunidad universitaria.
            </p>
          </div>

          <div className="landing-hero-image-side">
            <img
              src={Friends}
              alt="Comunidad universitaria conectada"
              className="unac-illustration-3d"
            />
          </div>
        </div>

        <section className="landing-cards-grid">
          <div className="landing-info-card">
            <div className="card-icon-container">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7FA0C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="card-text-content">
              <h3>Foro estudiantil</h3>
              <p>
                Entérate de comunicados, fechas de parciales, eventos institucionales
                y anuncios importantes de tus facultades.
              </p>
            </div>
          </div>

          <div className="landing-info-card">
            <div className="card-icon-container">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7FA0C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <polyline points="17 11 19 13 23 9" />
              </svg>
            </div>
            <div className="card-text-content">
              <h3>Regístrate</h3>
              <p>
                Crea tu cuenta, publica con varias categorías, comenta y participa
                en la vida de la comunidad UNAC.
              </p>
            </div>
          </div>
        </section>

        <div className="landing-action-container">
          <button type="button" onClick={entrarAlForo} className="landing-btn-enter">
            Entrar al foro
          </button>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="footer-logo">UNAC Forum — Proyecto parcial Programación Web</div>
      </footer>
    </div>
  );
}
