/**
 * main.jsx — Application Entry Point
 *
 * Mounts the React app into the #root element.
 * StrictMode is enabled for development quality checks.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
