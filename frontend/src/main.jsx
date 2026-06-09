/**
 * Punto de entrada de la aplicación React (Vite).
 * Monta el componente raíz `App` en el elemento `#root` del DOM.
 *
 * Precondición: `index.html` contiene `<div id="root"></div>`.
 * Postcondición: la SPA queda renderizada en modo estricto de React 18.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';

import './styles/global.css';
import './styles/auth.css';
import './styles/feed.css';
import './styles/formularioPost.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
