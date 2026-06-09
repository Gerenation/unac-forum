import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  registrarUsuario as svcRegistrar,
  loginUsuario as svcLogin,
  obtenerPerfil as svcPerfil
} from '../services/authService';

const AuthContext = createContext(null);

/** Clave en localStorage donde se guarda el JWT de sesión. */
const CLAVE_TOKEN = 'unac_forum_token';

/** Clave en localStorage donde se guarda el perfil público del usuario. */
const CLAVE_USUARIO = 'unac_forum_usuario';

/**
 * Proveedor global de autenticación para toda la aplicación React.
 * Gestiona login, registro, logout, hidratación inicial y refresco de perfil.
 *
 * Precondición: debe envolver el árbol de rutas dentro de `<BrowserRouter>`.
 * Postcondición: los componentes hijos pueden consumir sesión con `useAuth()`.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Subárbol de la aplicación.
 * @returns {JSX.Element} Contexto de autenticación disponible para descendientes.
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const texto = localStorage.getItem(CLAVE_USUARIO);
      return texto ? JSON.parse(texto) : null;
    } catch {
      return null;
    }
  });
  const [cargando, setCargando] = useState(true);

  /**
   * Al montar la app, valida el token almacenado contra el endpoint de perfil.
   * Si el token expiró o es inválido, limpia la sesión local.
   */
  useEffect(() => {
    let activo = true;
    async function inicializar() {
      const token = localStorage.getItem(CLAVE_TOKEN);
      if (!token) {
        if (activo) setCargando(false);
        return;
      }
      try {
        const data = await svcPerfil();
        if (activo) {
          setUsuario(data.usuario);
          localStorage.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario));
        }
      } catch {
        if (activo) {
          localStorage.removeItem(CLAVE_TOKEN);
          localStorage.removeItem(CLAVE_USUARIO);
          setUsuario(null);
        }
      } finally {
        if (activo) setCargando(false);
      }
    }
    inicializar();
    return () => {
      activo = false;
    };
  }, []);

  /**
   * Autentica al usuario y persiste token + perfil en localStorage.
   *
   * @param {string} correo - Correo del usuario.
   * @param {string} contrasena - Contraseña en texto plano.
   * @returns {Promise<Object>} Perfil público del usuario autenticado.
   */
  async function login(correo, contrasena) {
    const data = await svcLogin({ correo, contrasena });
    localStorage.setItem(CLAVE_TOKEN, data.token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  /**
   * Registra un usuario nuevo e inicia sesión automáticamente.
   *
   * @param {Object} datos - Campos del formulario de registro.
   * @returns {Promise<Object>} Perfil del usuario recién creado.
   */
  async function registro(datos) {
    const data = await svcRegistrar(datos);
    localStorage.setItem(CLAVE_TOKEN, data.token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  /**
   * Cierra la sesión eliminando credenciales del almacenamiento local.
   *
   * Postcondición: `usuario` pasa a `null` y `estaAutenticado` es falso.
   */
  function logout() {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    setUsuario(null);
  }

  /**
   * Vuelve a cargar el perfil desde el servidor (útil tras editar datos).
   *
   * @returns {Promise<Object>} Perfil actualizado del usuario en sesión.
   */
  async function refrescarUsuario() {
    const data = await svcPerfil();
    setUsuario(data.usuario);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario));
    return data.usuario;
  }

  const value = useMemo(
    () => ({
      usuario,
      cargando,
      estaAutenticado: !!usuario,
      login,
      registro,
      logout,
      refrescarUsuario
    }),
    [usuario, cargando]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para acceder al contexto de autenticación desde cualquier componente hijo.
 *
 * Precondición: debe usarse dentro de `<AuthProvider>`.
 *
 * @returns {{usuario: Object|null, cargando: boolean, estaAutenticado: boolean, login: Function, registro: Function, logout: Function, refrescarUsuario: Function}}
 */
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}
