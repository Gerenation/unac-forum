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
