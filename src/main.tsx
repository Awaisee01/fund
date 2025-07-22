
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log('Main.tsx loading...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error("Root element not found");
}

console.log('Creating React root...');
const root = createRoot(rootElement);

console.log('Rendering App...');
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('App rendered successfully');
