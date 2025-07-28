
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import UltimatePerformanceOptimizer from "./components/UltimatePerformanceOptimizer";
import "./lib/console-override";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <UltimatePerformanceOptimizer>
      <App />
    </UltimatePerformanceOptimizer>
  </StrictMode>
);
