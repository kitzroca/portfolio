import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


/* Portfolio Custom Design System (verbatim from CodeIgniter 3) */
import './styles/style.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
