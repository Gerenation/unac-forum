import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/landing.css'; 
import Fondo from '../assets/Fondo.png'; 
import Friends from '../assets/Friends.png';

// Asegúrate de tener esta imagen en tu carpeta de assets

export default function Landing() {
  const navigate = useNavigate();

  const handleEnterForum = () => {
    navigate('/login'); // O la ruta que maneje tu login/feed
  };

  return (
  <div
    className="landing-page-bg"
    style={{
      backgroundImage: `linear-gradient(rgba(11,15,25,0.88), rgba(11,15,25,0.95)), url(${Fondo})`
    }}
  >
      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="landing-main-content">
        <div className="landing-hero-section">
          
          {/* Lado Izquierdo: Textos principales */}
          <div className="landing-hero-text-side">
            <h1 className="landing-hero-title">
              CONÉCTATE,<br />
              COMPARTE Y<br />
              CRECE CON<br />
              LA UNAC.
            </h1>
            <p className="landing-hero-subtitle">
              UNAC Forum: El punto de encuentro oficial para parches, anuncios y bienestar de tu comunidad universitaria.
            </p>
          </div>

          {/* Lado Derecho: Contenedor para la ilustración 3D */}
          <div className="landing-hero-image-side">
            {/* Aquí va tu imagen generada con los estudiantes y la red flotante */}
            <img 
              src={Friends} 
              alt="Comunidad Universitaria Conectada" 
              className="unac-illustration-3d"
            />
          </div>
        </div>

        {/* --- SECCIÓN DE TARJETAS (CARDS) --- */}
        <section className="landing-cards-grid">
          
          {/* Tarjeta 1: Opción 1 / Login */}
          <div className="landing-info-card">
            <div className="card-icon-container">
              {/* Icono de burbujas de chat */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7FA0C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="card-text-content">
              <h3>Descripcion</h3>
              <p>Enterate de los comunicados de rectoría, fechas de parciales, eventos institucionales y anuncios importantes de tus facultades.</p>
            </div>
          </div>

          {/* Tarjeta 2: Registra */}
          <div className="landing-info-card">
            <div className="card-icon-container">
              {/* Icono de usuario con flechas */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7FA0C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <polyline points="17 11 19 13 23 9"></polyline>
              </svg>
            </div>
            <div className="card-text-content">
              <h3>Registra</h3>
              <p>Registro: El punto de encuentro oficial para parches, anuncios y bienestar de tu comunidad universitaria, tu usuario se usará en esta sesión del navegador.</p>
            </div>
          </div>

        </section>

        {/* --- BOTÓN CENTRAL --- */}
        <div className="landing-action-container">
          <button onClick={handleEnterForum} className="landing-btn-enter">
            Entrar al foro
          </button>
        </div>
      </main>

        {/* --- PIE DE PÁGINA --- */}           
        <footer className="landing-footer">
          
        
          <div className="footer-logo">UNAC Forum</div>
        </footer>
    </div>
  );
}