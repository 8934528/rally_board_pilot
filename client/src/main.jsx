import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './styles/global.css';
import './styles/board.css';
import './styles/controller.css';
import './styles/host.css';
import './styles/themes.css';
import './styles/animations.css';
import './styles/controller-console.css';

import App from './App';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
