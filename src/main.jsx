import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Show loading message right away
const rootEl = document.getElementById('root');
if (rootEl) {
  rootEl.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; text-align: center;">
      <h2>Loading application...</h2>
      <p>If this message doesn't disappear, check the browser console for errors.</p>
    </div>
  `;
}

// Log important information
console.log('React initialization starting');
console.log('React version:', React.version);
console.log('Environment:', import.meta.env.MODE);

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Display error on page for debugging
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1 style="color: #ff3366;">Application Error</h1>
        <p>There was an error starting the application:</p>
        <pre style="background: #f1f1f1; padding: 15px; border-radius: 4px; overflow: auto; max-width: 100%;">
          ${event.error?.stack || event.error?.message || 'Unknown error'}
        </pre>
        <p>URL: ${window.location.href}</p>
        <p>User Agent: ${navigator.userAgent}</p>
        <p>Time: ${new Date().toString()}</p>
        <p><a href="/debug.html" style="color: blue;">Open Debug Page</a></p>
      </div>
    `;
  }
});

try {
  const root = createRoot(document.getElementById('root'));
  console.log('Root element found and createRoot called');
  
  // Delay rendering slightly to ensure all assets have loaded
  setTimeout(() => {
    try {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
      console.log('React render completed successfully');
    } catch (renderError) {
      console.error('Error during React render:', renderError);
      
      if (rootEl) {
        rootEl.innerHTML = `
          <div style="padding: 20px; font-family: sans-serif;">
            <h1 style="color: #ff3366;">Render Error</h1>
            <p>Failed to render React application:</p>
            <pre style="background: #f1f1f1; padding: 15px; border-radius: 4px; overflow: auto; max-width: 100%;">
              ${renderError?.stack || renderError?.message || 'Unknown error'}
            </pre>
            <p><a href="/debug.html" style="color: blue;">Open Debug Page</a></p>
          </div>
        `;
      }
    }
  }, 300);
} catch (error) {
  console.error('Error during React initialization:', error);
  
  // Display error on page
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1 style="color: #ff3366;">Initialization Error</h1>
        <p>Failed to initialize React application:</p>
        <pre style="background: #f1f1f1; padding: 15px; border-radius: 4px; overflow: auto; max-width: 100%;">
          ${error?.stack || error?.message || 'Unknown error'}
        </pre>
        <p><a href="/debug.html" style="color: blue;">Open Debug Page</a></p>
      </div>
    `;
  }
}
