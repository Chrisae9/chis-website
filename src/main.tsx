import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Make Buffer available globally
window.Buffer = Buffer;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
