import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Global tokens/base styles first so component stylesheets can override them.
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
