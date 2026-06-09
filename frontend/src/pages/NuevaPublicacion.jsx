import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Message from '../components/ui/Message';
import { crearPublicacion } from '../services/publicacionService';
import { CATEGORIAS_DISPONIBLES, etiquetaCategoria, LONGITUD_MAXIMA_TITULO } from '../constants/categorias';

export default function NuevaPublicacion() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');

    if (!titulo.trim() || !contenido.trim() || !categoria) {
      setError('Completa todos los campos.');
      return;
    }
    if (titulo.trim().length > LONGITUD_MAXIMA_TITULO) {
      setError(`El título no puede superar ${LONGITUD_MAXIMA_TITULO} caracteres.`);
      return;
    }
    if (!CATEGORIAS_DISPONIBLES.includes(categoria)) {
      setError('Categoría inválida.');
      return;
    }

    setEnviando(true);
    try {
      await crearPublicacion({
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        categoria
      });
      setTimeout(() => navigate('/explorar'), 450);
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'No se pudo crear la publicación.';
      setError(mensaje);
      setEnviando(false);
    }
  }

  return (
    <>
      <Header
        subtitulo="Nueva entrada en el tablón"
        navLabel="Navegación"
        navLinks={[
          {
            kind: 'link',
            to: '/perfil',
            label: 'Mi perfil',
            className: 'boton-secundario'
          },
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
            id="formularioCrearPost"
            className="formulario-crear-post"
            method="post"
            onSubmit={manejarEnvio}
            noValidate
          >
            <h1>Nueva publicación</h1>
            <p className="texto-ayuda">
              Comparte convocatorias, eventos, alertas o temas de interés para la
              comunidad estudiantil.
            </p>
            <div className="campo-formulario">
              <label htmlFor="titulo">Título</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                maxLength={LONGITUD_MAXIMA_TITULO}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
              <span className="hint-caracteres">
                Máximo {LONGITUD_MAXIMA_TITULO} caracteres (incluidos espacios).
              </span>
            </div>
            <div className="campo-formulario">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="" disabled>Selecciona una categoría</option>
                {CATEGORIAS_DISPONIBLES.map((cat) => (
                  <option key={cat} value={cat}>
                    {etiquetaCategoria(cat)}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo-formulario">
              <label htmlFor="contenido">Descripción</label>
              <textarea
                id="contenido"
                name="contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                required
                placeholder="Detalle del anuncio o tema de interés…"
              />
            </div>
            <Message texto={error} error />
            <div className="acciones-crear-post">
              <button type="submit" className="boton-primario" disabled={enviando}>
                {enviando ? 'Publicando…' : 'Publicar en el foro'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
