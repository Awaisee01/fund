console.log('🔥 MINIMAL DEBUG: Starting super basic React test');
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Test if React can even render a simple div
const testDiv = document.createElement('div');
testDiv.innerHTML = '<h1>BASIC TEST WORKING</h1>';
testDiv.style.cssText = 'position: fixed; top: 0; left: 0; background: red; color: white; padding: 20px; z-index: 9999;';
document.body.appendChild(testDiv);

try {
  console.log('🔥 MINIMAL DEBUG: React imports successful');
  
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error('💥 CRITICAL: Root element not found!');
    throw new Error("Root element not found");
  }
  console.log('🔥 MINIMAL DEBUG: Root element found');

  const root = createRoot(rootElement);
  console.log('🔥 MINIMAL DEBUG: Root created');
  
  // Try to render the simplest possible React component
  root.render(
    <StrictMode>
      <div style={{padding: '20px', background: 'green', color: 'white'}}>
        <h1>REACT IS WORKING!</h1>
      </div>
    </StrictMode>
  );
  console.log('🔥 MINIMAL DEBUG: Simple React render successful');
  
} catch (error) {
  console.error('💥 CRITICAL: Basic React test failed:', error);
  document.body.innerHTML = `<div style="padding: 40px; background: blue; color: white;"><h1>React Failed</h1><p>${error}</p></div>`;
}