import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    allowedHosts: ['ecca-202-166-206-36.ngrok-free.app', 'https://kxfsxtk6-5173.inc1.devtunnels.ms/'],
  },
})
