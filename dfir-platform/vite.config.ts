import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    rolldownOptions: {
      external: [],
    },
    chunkSizeWarningLimit: 2000,
  },
  optimizeDeps: {
    include: ['react-is', 'recharts'],
  },
})
