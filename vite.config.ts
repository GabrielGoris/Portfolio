import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // O chunk do Three.js (~950 kB) é carregado sob demanda pela janela do NewCAD
    chunkSizeWarningLimit: 1000,
  },
})
