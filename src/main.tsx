/**
 * Application Entry Point
 * 
 * This file initializes the React application and sets up the core providers:
 * - React StrictMode for highlighting potential problems
 * - BrowserRouter for client-side routing
 * - Buffer polyfill for browser compatibility
 */

// React and React DOM imports
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Router
import { BrowserRouter } from 'react-router-dom';

// Polyfills
import { Buffer } from 'buffer';

// Application components and styles
import App from './App';
import './index.css';

// Make Buffer available globally for markdown processing libraries
window.Buffer = Buffer;

// Initialize the React application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
