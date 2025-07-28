import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import UltimatePerformanceOptimizer from "./components/UltimatePerformanceOptimizer";
import AccessibilityOptimizer from "./components/AccessibilityOptimizer";
import CompressionOptimizer from "./components/CompressionOptimizer";
import PerformanceMonitor from "./components/PerformanceMonitor";
import { preloadRouteComponents } from "./components/LazyComponentLoader";
import "./lib/console-override";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Preload critical route components
preloadRouteComponents();

root.render(
  <StrictMode>
    <UltimatePerformanceOptimizer>
      <AccessibilityOptimizer />
      <CompressionOptimizer />
      <PerformanceMonitor>
        <App />
      </PerformanceMonitor>
    </UltimatePerformanceOptimizer>
  </StrictMode>
);