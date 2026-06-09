import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Message from '../components/ui/Message';
import SiteBrand from '../components/layout/SiteBrand';

/**
 * Pantalla de registro de nuevos usuarios en el foro.
 *
 * Funcionalidad cubierta: registrar usuario e iniciar sesión automáticamente.
 *
 * Precondición: correo y nombre de usuario no deben existir previamente en la base de datos.
 * Postcondición: cuenta creada, JWT almacenado y redirección al feed.
 *
 * @returns {JSX.Element} Formulario de registro.
 */
export default function Registro() {
  const { registro, estaAutenticado, cargando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('layout-centrado');
    return () => document.body.classList.remove('layout-centrado');
  }, []);

  useEffect(() => {
    if (!cargando && estaAutenticado) {
      navigate('/explorar', { replace: true });
    }
  }, [cargando, estaAutenticado, navigate]);

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [contrasenaConfirmacion, setContrasenaConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  /**
   * Valida campos locales y registra al usuario en el backend.
   *
   * @param {import('react').FormEvent} e - Evento submit.
   */
  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');

    if (!nombreCompleto.trim() || !nombreUsuario.trim() || !correo.trim() || !contrasena) {
      setError('Completa todos los campos.');
      return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (contrasena !== contrasenaConfirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setEnviando(true);
    try {
      await registro({
        nombreCompleto: nombreCompleto.trim(),
        nombreUsuario: nombreUsuario.trim(),
        correo: correo.trim(),
        contrasena
      });
      setTimeout(() => navigate('/explorar'), 400);
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'No se pudo crear la cuenta.';
      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <header className="cabecera-sitio">
        <div className="cabecera-sitio-interior">
          <SiteBrand subtitulo="Foro de anuncios y temas de interés universitario" />
        </div>
      </header>
      <main>
        <section className="tarjeta-auth" aria-labelledby="tituloRegistro">
          <h2 id="tituloRegistro" className="tarjeta-auth-titulo">Crear cuenta</h2>
          <p className="tarjeta-auth-descripcion">
            Registro simulado: tu usuario se guarda en la base de datos y queda
            activo en esta sesión del navegador.
          </p>
          <form
            id="formularioRegistro"
            className="formulario-auth"
            method="post"
            onSubmit={manejarEnvio}
            noValidate
          >
            <div className="campo-formulario">
              <label htmlFor="nombreCompleto">Nombre completo</label>
              <input
                id="nombreCompleto"
                name="nombreCompleto"
                type="text"
                autoComplete="name"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                required
              />
            </div>
            <div className="campo-formulario">
              <label htmlFor="nombreUsuario">Nombre de usuario</label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                autoComplete="nickname"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
              />
            </div>
            <div className="campo-formulario">
              <label htmlFor="correo">Correo</label>
              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="campo-formulario">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                autoComplete="new-password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            <div className="campo-formulario">
              <label htmlFor="contrasenaConfirmacion">Confirmar contraseña</label>
              <input
                id="contrasenaConfirmacion"
                name="contrasenaConfirmacion"
                type="password"
                autoComplete="new-password"
                value={contrasenaConfirmacion}
                onChange={(e) => setContrasenaConfirmacion(e.target.value)}
                required
              />
            </div>
            <Message texto={error} error />
            <div className="acciones-formulario-auth">
              <button type="submit" className="boton-primario" disabled={enviando}>
                {enviando ? 'Creando…' : 'Registrarme'}
              </button>
            </div>
          </form>
          <p className="enlaces-auth">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </section>
      </main>
      <footer className="pie-sitio">
        <p>Proyecto parcial — UNAC Forum (React + Node.js)</p>
      </footer>
    </>
  );
}
