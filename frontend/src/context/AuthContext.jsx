import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  registrarUsuario as svcRegistrar,
  loginUsuario as svcLogin,
  obtenerPerfil as svcPerfil
} from '../services/authService';

const AuthContext = createContext(null);

const CLAVE_TOKEN = 'unac_forum_token';
const CLAVE_USUARIO = 'unac_forum_usuario';

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

  async function login(correo, contrasena) {
    const data = await svcLogin({ correo, contrasena });
    localStorage.setItem(CLAVE_TOKEN, data.token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  async function registro(datos) {
    const data = await svcRegistrar(datos);
    localStorage.setItem(CLAVE_TOKEN, data.token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    setUsuario(null);
  }

  const value = useMemo(
    () => ({
      usuario,
      cargando,
      estaAutenticado: !!usuario,
      login,
      registro,
      logout
    }),
    [usuario, cargando]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}
