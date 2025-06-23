import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./ssl/key.pem'),
      cert: fs.readFileSync('./ssl/cert.pem')
    },
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://192.168.1.58:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://192.168.1.58:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
