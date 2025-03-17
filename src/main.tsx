
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log to confirm environment variables are loaded
console.log('Supabase URL available:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Anon Key available:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

createRoot(document.getElementById("root")!).render(<App />);
