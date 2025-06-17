const express = require('express');
const multer = require('multer');
const path = require('path');
const Asset = require('../models/asset');
const router = express.Router();
const mongoose=require("mongoose")
// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads'); // correct path
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.mp4', '.glb', '.fbx', '.obj'];
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, GLB, FBX, and OBJ files are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

// Upload asset
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('REQ HEADERS:', req.headers);         // ✅ debug
    console.log('REQ FILE:', req.file);               // ✅ debug

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const assetType = path.extname(req.file.originalname) === '.mp4' ? 'video' : 'model';

    const newAsset = new Asset({
      name: req.file.originalname,
      type: assetType,
      path: req.file.filename,
    });

    await newAsset.save();
    res.status(201).json(newAsset);
  } catch (error) {
    console.error('UPLOAD ERROR:', error);            // ✅ debug
    res.status(500).json({ error: error.message });
  }
});


// Get all assets
// In your backend/routes/assets.js
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


module.exports = router;