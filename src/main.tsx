
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./lib/console-override";
import "./index.css"; // Empty file - keeps build happy

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Mark critical rendering start
if ('performance' in window && 'mark' in performance) {
  performance.mark('react-start');
}

console.log('🚀 Main.tsx: Starting React app render');

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('✅ Main.tsx: React app render completed');
