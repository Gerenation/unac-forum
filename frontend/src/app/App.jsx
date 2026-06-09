import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Feed from '../pages/Feed';
import NuevaPublicacion from '../pages/NuevaPublicacion';
import Perfil from '../pages/Perfil';
import Landing from '../pages/Landing';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161d2a',
              color: '#e8edf4',
              border: '1px solid #2d3d52'
            }
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Landing />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/explorar"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nueva-publicacion"
            element={
              <ProtectedRoute>
                <NuevaPublicacion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
