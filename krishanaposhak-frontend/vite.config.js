import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@config': path.resolve(__dirname, './src/config'),
      '@types': path.resolve(__dirname, './src/types'),
      '@validators': path.resolve(__dirname, './src/validators'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        compact: true,
        experimentalMinChunkSize: 8192,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/') || id.includes('react-router') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('react-icons/fi')) {
              return 'vendor-icons-feather';
            }
            if (id.includes('react-icons/fa')) {
              return 'vendor-icons-fa';
            }
            if (id.includes('react-icons/hi')) {
              return 'vendor-icons-hi';
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons-other';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('d3')) {
              return 'vendor-d3';
            }
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform/resolvers')) {
              return 'vendor-forms';
            }
            if (id.includes('swiper')) {
              return 'vendor-swiper';
            }
            if (id.includes('axios')) {
              return 'vendor-http';
            }
            if (id.includes('react-hot-toast') || id.includes('react-helmet-async') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }
            return 'vendor-other';
          }
        },
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 250,
    reportCompressedSize: false,
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'framer-motion',
      'react-icons/fi',
      'react-icons/fa',
      'react-icons/hi',
      'react-helmet-async',
      'react-hot-toast',
      'react-hook-form',
      'zod',
      '@hookform/resolvers',
      'clsx',
      'tailwind-merge',
    ],
  },
  css: {
    devSourcemap: false,
  },
});
