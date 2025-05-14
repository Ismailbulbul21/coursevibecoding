import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Display error on page for debugging
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1 style="color: #ff3366;">Application Error</h1>
        <p>There was an error starting the application:</p>
        <pre style="background: #f1f1f1; padding: 15px; border-radius: 4px; overflow: auto; max-width: 100%;">
          ${event.error?.stack || event.error?.message || 'Unknown error'}
        </pre>
      </div>
    `;
  }
});

try {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  console.error('Error during React initialization:', error);
  
  // Display error on page
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1 style="color: #ff3366;">Initialization Error</h1>
        <p>Failed to initialize React application:</p>
        <pre style="background: #f1f1f1; padding: 15px; border-radius: 4px; overflow: auto; max-width: 100%;">
          ${error?.stack || error?.message || 'Unknown error'}
        </pre>
      </div>
    `;
  }
}
