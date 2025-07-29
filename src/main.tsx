console.log('🚀 MAIN DEBUG: Main.tsx file loading started');
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
console.log('🚀 MAIN DEBUG: All imports loaded successfully');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('💥 CRITICAL: Root element not found!');
  throw new Error("Root element not found");
}
console.log('✅ MAIN DEBUG: Root element found:', rootElement);

const root = createRoot(rootElement);

// Mark critical rendering start
if ('performance' in window && 'mark' in performance) {
  performance.mark('react-start');
}

console.log('🚀 MAIN DEBUG: About to render App component');
try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ MAIN DEBUG: React render completed successfully');
} catch (error) {
  console.error('💥 CRITICAL: React render failed:', error);
}