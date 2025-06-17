// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import fs from 'fs';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     https: {
//       key: fs.readFileSync('./key.pem'),
//       cert: fs.readFileSync('./cert.pem')
//     },
//     proxy: {
//       '/api': {
//         target: 'https://localhost:5000',
//         changeOrigin: true,
//         secure: false
//       },
//       '/uploads': {
//         target: 'https://localhost:5000',
//         changeOrigin: true,
//         secure: false
//       }
//     },
//     host: true
//   }
// });


// vite.config.js



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// Only if you're using HTTPS for dev server
const useHttps = true;

export default defineConfig({
  plugins: [react()],
  server: {
    https: useHttps
      ? {
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/cert.pem')
      }
      : false,
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://192.168.1.27:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },

      '/uploads': {
        target: 'https://192.168.1.27:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})




