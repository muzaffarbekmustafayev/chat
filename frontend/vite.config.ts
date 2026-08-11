import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages':      path.resolve(__dirname, 'src/pages'),
      '@store':      path.resolve(__dirname, 'src/store'),
      '@hooks':      path.resolve(__dirname, 'src/hooks'),
      '@api':        path.resolve(__dirname, 'src/api'),
      '@utils':      path.resolve(__dirname, 'src/utils'),
      '@types':      path.resolve(__dirname, 'src/types'),
      '@context':    path.resolve(__dirname, 'src/context'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:5000', ws: true, changeOrigin: true },
    },
  },
})
