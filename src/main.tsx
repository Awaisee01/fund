// Emergency console log to verify script loading
console.log('🔥 MAIN: Script is executing');

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('🔥 MAIN: Imports successful');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('💥 CRITICAL: Root element not found!');
  document.body.innerHTML = '<div style="padding: 40px; background: orange; color: black;"><h1>ROOT ELEMENT MISSING</h1></div>';
  throw new Error("Root element not found");
}

console.log('🔥 MAIN: Root element found, creating React root');

const root = createRoot(rootElement);

// Mark critical rendering start
if ('performance' in window && 'mark' in performance) {
  performance.mark('react-start');
}

console.log('🔥 MAIN: About to render React app');
try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ MAIN: React render completed successfully');
} catch (error) {
  console.error('💥 CRITICAL: React render failed:', error);
  rootElement.innerHTML = '<div style="padding: 40px; background: red; color: white;"><h1>REACT RENDER FAILED</h1><p>' + String(error) + '</p></div>';
}