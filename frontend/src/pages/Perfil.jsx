import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Message from '../components/ui/Message';
import { useAuth } from '../context/AuthContext';
import { actualizarPerfil } from '../services/authService';

export default function Perfil() {
  const navigate = useNavigate();
  const { usuario, refrescarUsuario } = useAuth();

  const [nombreCompleto, setNombreCompleto] = useState(usuario?.nombreCompleto || '');
  const [nombreUsuario, setNombreUsuario] = useState(usuario?.nombreUsuario || '');
  const [correo, setCorreo] = useState(usuario?.correo || '');
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');

    const datosActualizar = {};

    if (nombreCompleto.trim() !== (usuario?.nombreCompleto || '')) {
      datosActualizar.nombreCompleto = nombreCompleto.trim();
    }
    if (nombreUsuario.trim() !== (usuario?.nombreUsuario || '')) {
      datosActualizar.nombreUsuario = nombreUsuario.trim();
    }
    if (correo.trim().toLowerCase() !== (usuario?.correo || '').toLowerCase()) {
      datosActualizar.correo = correo.trim();
    }
    if (contrasenaNueva.length > 0) {
      datosActualizar.contrasenaActual = contrasenaActual;
      datosActualizar.contrasenaNueva = contrasenaNueva;
    }

    if (Object.keys(datosActualizar).length === 0) {
      setError('No hay cambios para guardar.');
      return;
    }

    setEnviando(true);
    try {
      await actualizarPerfil(datosActualizar);
      await refrescarUsuario();
      toast.success('Perfil actualizado correctamente.');
      setTimeout(() => navigate('/explorar'), 400);
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'No se pudo actualizar el perfil.';
      setError(mensaje);
      setEnviando(false);
    }
  }

  return (
    <>
      <Header
        subtitulo="Información de tu cuenta"
        navLabel="Navegación de perfil"
        navLinks={[
          {
            kind: 'link',
            to: '/explorar',
            label: 'Volver al foro',
            className: 'boton-secundario'
          }
        ]}
      />
      <main>
        <div className="contenedor-formulario-post">
          <form
            id="formularioPerfil"
            className="formulario-crear-post"
            method="post"
            onSubmit={manejarEnvio}
            noValidate
          >
            <h1>Mi perfil</h1>
            <p className="texto-ayuda">
              Actualiza tu información personal. Los cambios se guardan al pulsar
              "Guardar cambios".
            </p>

            <div className="campo-formulario">
              <label htmlFor="nombreCompleto">Nombre completo</label>
              <input
                id="nombreCompleto"
                name="nombreCompleto"
                type="text"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                required
                minLength={2}
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="nombreUsuario">Nombre de usuario</label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                minLength={2}
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="contrasenaActual">Contraseña actual</label>
              <input
                id="contrasenaActual"
                name="contrasenaActual"
                type="password"
                value={contrasenaActual}
                onChange={(e) => setContrasenaActual(e.target.value)}
                autoComplete="current-password"
                placeholder="Déjala en blanco para no cambiar la contraseña"
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="contrasenaNueva">Contraseña nueva</label>
              <input
                id="contrasenaNueva"
                name="contrasenaNueva"
                type="password"
                value={contrasenaNueva}
                onChange={(e) => setContrasenaNueva(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
              <span className="hint-caracteres">
                Si no quieres cambiar tu contraseña, deja estos dos campos en blanco.
              </span>
            </div>

            <Message texto={error} error />
            <div className="acciones-crear-post">
              <button type="submit" className="boton-primario" disabled={enviando}>
                {enviando ? 'Guardando…' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
