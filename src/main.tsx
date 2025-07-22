
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/mobile-optimized.css';
import { loadNonCriticalCSS } from './utils/criticalCss';

// Initialize non-critical CSS loading
loadNonCriticalCSS();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
