import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Message from '../components/ui/Message';
import { crearPublicacion } from '../services/publicacionService';
import {
  CATEGORIAS_DISPONIBLES,
  etiquetaCategoria,
  LONGITUD_MAXIMA_TITULO,
  MAX_CATEGORIAS_POR_PUBLICACION
} from '../constants/categorias';

/**
 * Formulario para crear una nueva publicación en el foro con varias categorías.
 *
 * Funcionalidad cubierta: crear foros (publicaciones) con clasificación múltiple.
 *
 * Precondición: usuario autenticado; título, contenido y al menos una categoría válida.
 * Postcondición: la publicación se guarda en el backend y el usuario vuelve al feed.
 *
 * @returns {JSX.Element} Vista del formulario de nueva publicación.
 */
export default function NuevaPublicacion() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  /**
   * Marca o desmarca una categoría respetando el límite máximo permitido.
   *
   * @param {string} categoria - Identificador de categoría a alternar.
   */
  function alternarCategoria(categoria) {
    setCategoriasSeleccionadas((prev) => {
      if (prev.includes(categoria)) {
        return prev.filter((c) => c !== categoria);
      }
      if (prev.length >= MAX_CATEGORIAS_POR_PUBLICACION) {
        toast.error(`Puedes elegir hasta ${MAX_CATEGORIAS_POR_PUBLICACION} categorías.`);
        return prev;
      }
      return [...prev, categoria];
    });
  }

  /**
   * Valida el formulario y envía la publicación al servidor.
   *
   * @param {import('react').FormEvent} e - Evento submit.
   */
  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');

    if (!titulo.trim() || !contenido.trim()) {
      setError('Completa el título y la descripción.');
      return;
    }
    if (categoriasSeleccionadas.length === 0) {
      setError('Selecciona al menos una categoría para tu publicación.');
      return;
    }
    if (titulo.trim().length > LONGITUD_MAXIMA_TITULO) {
      setError(`El título no puede superar ${LONGITUD_MAXIMA_TITULO} caracteres.`);
      return;
    }

    setEnviando(true);
    try {
      await crearPublicacion({
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        categorias: categoriasSeleccionadas
      });
      toast.success('Publicación creada correctamente.');
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
              Comparte convocatorias, eventos, alertas o temas de interés. Puedes
              elegir hasta {MAX_CATEGORIAS_POR_PUBLICACION} categorías para describir
              mejor la intención de tu anuncio.
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
            <fieldset className="campo-formulario grilla-categorias-fieldset">
              <legend>Categorías (elige una o más)</legend>
              <div className="grilla-categorias" role="group" aria-label="Selección de categorías">
                {CATEGORIAS_DISPONIBLES.map((cat) => {
                  const activa = categoriasSeleccionadas.includes(cat);
                  return (
                    <label
                      key={cat}
                      className={`opcion-categoria${activa ? ' opcion-categoria-activa' : ''}`}
                    >
                      <input
                        type="checkbox"
                        name="categorias"
                        value={cat}
                        checked={activa}
                        onChange={() => alternarCategoria(cat)}
                      />
                      <span>{etiquetaCategoria(cat)}</span>
                    </label>
                  );
                })}
              </div>
              <span className="hint-caracteres">
                Seleccionadas: {categoriasSeleccionadas.length} / {MAX_CATEGORIAS_POR_PUBLICACION}
              </span>
            </fieldset>
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
