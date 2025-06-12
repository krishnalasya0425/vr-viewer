import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

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
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // or https if using SSL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});