
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TestApp from "./TestApp";
import UltimatePerformanceOptimizer from "./components/UltimatePerformanceOptimizer";
import "./lib/console-override";
import "./index.css";




const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error("Root element not found");
}


const root = createRoot(rootElement);


console.log('🚀 Starting app render...');

root.render(
  <StrictMode>
    <TestApp />
  </StrictMode>
);

console.log('✅ App render initiated');


