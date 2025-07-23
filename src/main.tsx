
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import PerformanceOptimizer from "./components/PerformanceOptimizer";
import "./lib/console-override";
import "./index.css";

// Defer non-critical mobile CSS to reduce render blocking
const loadMobileCSS = () => {
  const stylesheets = [
    "./styles/mobile-optimized.css",
    "./styles/mobile-fixes.css", 
    "./styles/emergency-fixes.css",
    "./styles/mobile-form-first.css",
    "./styles/mobile-layout-fix.css",
    "./styles/nuclear-mobile-fix.css"
  ];
  
  requestIdleCallback(() => {
    stylesheets.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
  });
};

// Load mobile CSS after initial render
setTimeout(loadMobileCSS, 0);



const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error("Root element not found");
}


const root = createRoot(rootElement);


root.render(
  <StrictMode>
    <PerformanceOptimizer>
      <App />
    </PerformanceOptimizer>
  </StrictMode>
);


