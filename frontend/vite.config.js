import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_REACT_ROUTER_FUTURE': JSON.stringify({
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }),
  },
});