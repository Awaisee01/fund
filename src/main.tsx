
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import PerformanceOptimizer from "./components/PerformanceOptimizer";
import "./lib/console-override";
import "./index.css";
import "./styles/mobile-optimized.css";
import "./styles/mobile-fixes.css";
import "./styles/emergency-fixes.css";
import "./styles/mobile-form-first.css";
import "./styles/mobile-layout-fix.css";
// import "./styles/nuclear-mobile-fix.css";



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


