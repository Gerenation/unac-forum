import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Envuelve rutas que requieren sesión activa (feed, nueva publicación, perfil).
 *
 * Precondición: el componente debe renderizarse dentro de `<AuthProvider>`.
 * Postcondición: si no hay sesión, redirige a `/login`; si la hay, muestra `children`.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Página protegida a mostrar.
 * @returns {JSX.Element|null} Contenido protegido, redirección o indicador de carga.
 */
export default function ProtectedRoute({ children }) {
  const { estaAutenticado, cargando } = useAuth();

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

  return children;
}
