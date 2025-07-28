
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LCPOptimizer } from "./components/LCPOptimizer";
import ModernPerformanceOptimizer from "./components/ModernPerformanceOptimizer";
import ScriptOptimizer from "./components/ScriptOptimizer";
import PerformanceMonitor from "./components/PerformanceMonitor";
import "./lib/console-override";
import "./index.css";




const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error("Root element not found");
}


const root = createRoot(rootElement);


root.render(
  <StrictMode>
    <LCPOptimizer>
      <PerformanceMonitor>
        <ScriptOptimizer>
          <ModernPerformanceOptimizer>
            <App />
          </ModernPerformanceOptimizer>
        </ScriptOptimizer>
      </PerformanceMonitor>
    </LCPOptimizer>
  </StrictMode>
);


