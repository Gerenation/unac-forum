import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Message from '../components/ui/Message';
import { useAuth } from '../context/AuthContext';
import { listarUsuarios as svcListarUsuarios, cambiarRolUsuario as svcCambiarRol } from '../services/authService';

/**
 * Página de administración de usuarios.
 * Permite listar todos los usuarios registrados y cambiar su rol (usuario/admin).
 *
 * Precondición: el usuario en sesión debe tener rol 'admin'.
 * Postcondición: se muestra una tabla de usuarios con selector de rol por cada uno.
 *
 * @returns {JSX.Element} Vista de administración de usuarios.
 */
export default function AdminUsuarios() {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [cambiandoRol, setCambiandoRol] = useState({});

  async function cargarUsuarios() {
    setCargando(true);
    setError('');
    try {
      const data = await svcListarUsuarios();
      setUsuarios(data.usuarios || []);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cargar la lista de usuarios.');
      toast.error(error);
    } finally {
      setCargando(false);
    }
  }

  async function manejarCambioRol(id, nuevoRol) {
    setCambiandoRol((prev) => ({ ...prev, [id]: true }));
    try {
      await svcCambiarRol(id, nuevoRol);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
      );
      toast.success(`Rol actualizado a ${nuevoRol}.`);
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

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const esAdmin = usuario && usuario.rol === 'admin';

  return (
    <>
      <Header
        subtitulo="Administración de usuarios"
        navLabel="Administración"
        navLinks={[
          {
            kind: 'link',
            to: '/explorar',
            label: 'Volver al foro',
            className: 'boton-secundario'
          }
        ]}
      />
      <main className="contenido-admin">
        <h1>Gestión de Usuarios</h1>
        <p className="descripcion-admin">
          Aquí puedes ver todos los usuarios registrados y modificar sus roles.
        </p>

        <Message texto={error} error />

        {cargando && usuarios.length === 0 ? (
          <p className="feed-vacio">Cargando usuarios…</p>
        ) : (
          <>
            <div className="tabla-usuarios-envoltura">
              <table className="tabla-usuarios">
                <thead>
                  <tr>
                    <th>Nombre completo</th>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Rol actual</th>
                    <th>Cambiar rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.nombreCompleto}</td>
                      <td>{u.nombreUsuario}</td>
                      <td>{u.correo}</td>
                      <td>
                        <span
                          className={`badge-rol badge-rol-${u.rol}`}
                          title={`Rol: ${u.rol}`}
                        >
                          {u.rol === 'admin' ? 'Administrador' : 'Usuario'}
                        </span>
                      </td>
                      <td>
                        <select
                          value={u.rol}
                          onChange={(e) => manejarCambioRol(u.id, e.target.value)}
                          disabled={cambiandoRol[u.id]}
                          className="select-rol"
                        >
                          <option value="usuario">Usuario</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </td>
                      <td>
                        {u.id === usuario.id && u.rol === 'admin' ? (
                          <span className="texto-protegido">(tu cuenta)</span>
                        ) : cambiandoRol[u.id] ? (
                          <span className="texto-cargando">Guardando…</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr>
                      <td colSpan="6" className="celda-vacia">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="nota-admin">
              <strong>Nota:</strong> no puedes quitarte tu propio rol de administrador desde esta pantalla.
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
