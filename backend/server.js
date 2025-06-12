// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const assetRoutes = require('./routes/assets');
// const path = require('path');
// const fs = require('fs');
// const https = require('https');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Read SSL certificate files
// let options;
// try {
//   options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
//   };
// } catch (err) {
//   console.error('Error reading SSL certificate files:', err);
//   process.exit(1);
// }

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/assets', assetRoutes);

// // Serve static files from uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Serve frontend in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/dist')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
//   });
// }

// // Create HTTPS server
// https.createServer(options, app).listen(PORT, () => {
//   console.log(`Server running on port ${PORT} (HTTPS)`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const assetRoutes = require('./routes/assets'); // adjust path as needed
const path = require('path');
const app = express();
// In server.js
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use('/api/assets', assetRoutes); // Mount here



app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.glb')) {
      res.set('Content-Type', 'model/gltf-binary');
      res.set('Access-Control-Allow-Origin', '*');
    }
  }
}));



mongoose.connect('mongodb://localhost:27017/vr_assets', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
