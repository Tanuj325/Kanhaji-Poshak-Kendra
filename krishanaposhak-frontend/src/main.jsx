import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/queryConfig';
import { Toaster } from 'react-hot-toast';
import '@/styles/index.css';
import App from '@/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure index.html has a <div id="root"></div>.');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 36, 64, 0.96)',
            color: '#F8F6F3',
            border: '1px solid rgba(201, 154, 59, 0.24)',
            boxShadow: '0 24px 48px rgba(15, 36, 64, 0.28)',
            borderRadius: '16px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            padding: '14px 16px',
          },
          success: {
            iconTheme: {
              primary: '#C99A3B',
              secondary: '#0F2440',
            },
          },
          error: {
            iconTheme: {
              primary: '#9B1D20',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
