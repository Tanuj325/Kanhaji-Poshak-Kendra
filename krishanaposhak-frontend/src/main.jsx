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
            background: '#0F1F32',
            color: '#FFFFFF',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#FBBF24',
              secondary: '#0F1F32',
            },
          },
          error: {
            iconTheme: {
              primary: '#F43F5E',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
