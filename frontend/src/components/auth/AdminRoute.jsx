import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Envuelve rutas que requieren rol de administrador.
 *
 * Precondición: el componente debe renderizarse dentro de `<AuthProvider>`.
 * Postcondición: si no hay sesión o el rol no es 'admin', redirige con mensaje de error.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Página de administración a mostrar.
 * @returns {JSX.Element|null} Contenido de administración, redirección o indicador de carga.
 */
export default function AdminRoute({ children }) {
  const { usuario, cargando, estaAutenticado } = useAuth();

  if (cargando) {
    return (
      <p className="cargando-sesion" role="status" aria-live="polite">
        Verificando permisos de administrador…
      </p>
    );
  }

  if (!estaAutenticado) {
    toast.error('Debes iniciar sesión para acceder a la administración.');
    return <Navigate to="/login" replace />;
  }

  if (usuario?.rol !== 'admin') {
    toast.error('No tienes permisos de administrador para esta sección.');
    return <Navigate to="/explorar" replace />;
  }

  return children;
}
