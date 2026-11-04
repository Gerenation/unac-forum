import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Envuelve rutas que requieren sesión activa (feed, nueva publicación, perfil).
 *
 * Los administradores NO pueden acceder a estas rutas normales del foro;
 * son redirigidos al panel de administración (`/admin`).
 *
 * Precondición: el componente debe renderizarse dentro de `<AuthProvider>`.
 * Postcondición: si no hay sesión, redirige a `/login`; si es admin, redirige a `/admin`;
 * si es usuario común, muestra `children`.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Página protegida a mostrar.
 * @returns {JSX.Element|null} Contenido protegido, redirección o indicador de carga.
 */
export default function ProtectedRoute({ children }) {
  const { estaAutenticado, cargando, usuario } = useAuth();

  if (cargando) {
    return (
      <p className="cargando-sesion" role="status" aria-live="polite">
        Verificando sesión…
      </p>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  // Los administradores no usan el foro normal; van al panel de administración
  if (usuario?.rol === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
