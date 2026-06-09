import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Message from '../components/ui/Message';
import SiteBrand from '../components/layout/SiteBrand';

/**
 * Pantalla de inicio de sesión del foro UNAC.
 *
 * Funcionalidad cubierta: manejo de sesión (login) y persistencia de JWT.
 *
 * Precondición: el usuario tiene cuenta registrada con correo y contraseña válidos.
 * Postcondición: token y perfil guardados en localStorage; redirección al feed.
 *
 * @returns {JSX.Element} Formulario de autenticación.
 */
export default function Login() {
  const { login, estaAutenticado, cargando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('layout-centrado');
    return () => document.body.classList.remove('layout-centrado');
  }, []);

  /** Si ya hay sesión activa, envía al feed sin pedir credenciales de nuevo. */
  useEffect(() => {
    if (!cargando && estaAutenticado) {
      navigate('/explorar', { replace: true });
    }
  }, [cargando, estaAutenticado, navigate]);

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  /**
   * Envía credenciales al backend y abre sesión en el cliente.
   *
   * @param {import('react').FormEvent} e - Evento submit del formulario.
   */
  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');
    if (!correo.trim() || !contrasena) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    setEnviando(true);
    try {
      await login(correo.trim(), contrasena);
      setTimeout(() => navigate('/explorar'), 400);
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'No se pudo iniciar sesión.';
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
        <section className="tarjeta-auth" aria-labelledby="tituloLogin">
          <h2 id="tituloLogin" className="tarjeta-auth-titulo">Iniciar sesión</h2>
          <p className="tarjeta-auth-descripcion">
            Accede con tu correo institucional (simulación con usuarios de
            prueba). Ejemplo: <span className="enlace-sutil">pepito.perez@estudiantes.unac.edu</span>
            / <span className="enlace-sutil">demo123</span>
          </p>
          <form
            id="formularioLogin"
            className="formulario-auth"
            method="post"
            onSubmit={manejarEnvio}
            noValidate
          >
            <div className="campo-formulario">
              <label htmlFor="correo">Correo</label>
              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="username"
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
                autoComplete="current-password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            <Message texto={error} error />
            <div className="acciones-formulario-auth">
              <button type="submit" className="boton-primario" disabled={enviando}>
                {enviando ? 'Entrando…' : 'Entrar al foro'}
              </button>
            </div>
          </form>
          <p className="enlaces-auth">
            ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </section>
      </main>
      <footer className="pie-sitio">
        <p>Proyecto parcial — UNAC Forum (React + Node.js)</p>
      </footer>
    </>
  );
}
