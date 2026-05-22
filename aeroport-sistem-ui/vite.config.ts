import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/aeronave': 'http://localhost:8000',
      '/voo': 'http://localhost:8000',
      '/passageiro': 'http://localhost:8000',
      '/passagem': 'http://localhost:8000'
    }
  }
})