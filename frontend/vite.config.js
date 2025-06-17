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
  plugins: [react()],
 server: {
https: {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
},
  host: '0.0.0.0', // 👈 allows other devices to access
  port: 5173,
  proxy: {
    '/api': 'https://192.168.1.27:5000',
    '/uploads': 'https://192.168.1.27:5000'
  }
}


});

