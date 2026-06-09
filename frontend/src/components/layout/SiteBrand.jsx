import logoUnac from '../../assets/logo.svg';

/**
 * Muestra la marca visual del foro (logo UNAC + título + subtítulo opcional).
 *
 * Precondición: el archivo `assets/logo.svg` debe existir en el proyecto frontend.
 * Postcondición: se renderiza el encabezado de marca accesible con texto alternativo en el logo.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.subtitulo] - Texto descriptivo bajo el título principal.
 * @returns {JSX.Element} Bloque de marca para la cabecera del sitio.
 */
export default function SiteBrand({ subtitulo }) {
  return (
    <div className="marca-sitio marca-sitio-con-logo">
      <img
        src={logoUnac}
        alt="Logo UNAC Forum"
        className="marca-sitio-logo"
        width={44}
        height={44}
      />
      <div>
        <h1 className="marca-sitio-titulo">UNAC Forum</h1>
        {subtitulo ? <p className="marca-sitio-subtitulo">{subtitulo}</p> : null}
      </div>
    </div>
  );
}
