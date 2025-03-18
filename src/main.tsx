
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log initialization
console.log('Main script initializing');

// Log to confirm environment variables are loaded
console.log('Supabase URL available:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Anon Key available:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Get the root element
const rootElement = document.getElementById("root");
console.log('Root element found:', !!rootElement);

if (rootElement) {
  try {
    console.log('Creating root and rendering App');
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering App:', error);
    // Display a fallback UI if rendering fails
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f3f4f6;">
        <div style="text-align: center; padding: 2rem; background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Application Error</h1>
          <p style="margin-bottom: 1rem;">There was a problem loading the application.</p>
          <p style="font-size: 0.875rem; color: #6b7280;">Check the console for more details.</p>
          <button 
            onclick="window.location.reload()" 
            style="margin-top: 1rem; padding: 0.5rem 1rem; background-color: #3b82f6; color: white; border-radius: 0.25rem; border: none; cursor: pointer;"
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
}
