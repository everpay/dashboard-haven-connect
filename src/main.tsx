
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

// Initialize the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the app
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// Initialize Preline UI
document.addEventListener('DOMContentLoaded', () => {
  import('preline');
});

// Reinitialize Preline UI on route change
let initialized = false;
const observer = new MutationObserver(() => {
  if (!initialized) {
    initialized = true;
    return;
  }
  import('preline/preline').then(({ HSStaticMethods }) => {
    HSStaticMethods.autoInit();
  });
});

observer.observe(document.body, { childList: true, subtree: true });
