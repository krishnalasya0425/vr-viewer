const express = require('express');
const multer = require('multer');
const path = require('path');
const Asset = require('../models/asset');
const router = express.Router();
const mongoose=require("mongoose")
const fs=require("fs")
// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    const baseName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    
    let finalName = baseName + ext;
    let fullPath = path.join(uploadDir, finalName);
    let counter = 1;

    // Auto-rename if file exists
    while (fs.existsSync(fullPath)) {
      finalName = `${baseName}(${counter})${ext}`;
      fullPath = path.join(uploadDir, finalName);
      counter++;
    }

    cb(null, finalName);
  }
});

// File filter to allow only supported types
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

// Upload route
router.post('/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Upload failed: ' + err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const savedName = req.file.filename; // final filename on disk
      const assetType = path.extname(savedName).toLowerCase() === '.mp4' ? 'video' : 'model';

      const newAsset = new Asset({
        name: savedName,
        type: assetType,
        path: savedName,
      });

      await newAsset.save();
      res.status(201).json(newAsset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

router.get('/', async (req, res) => {
  try {
    const allAssets = await Asset.find().sort({ createdAt: -1 });

    const filteredAssets = allAssets.filter(asset => {
      const filePath = path.join(__dirname, '../uploads', asset.path);
      return fs.existsSync(filePath);
    });

    res.json(filteredAssets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE asset by ID
router.delete('/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    // Delete file from disk
    const filePath = path.join(__dirname, '../uploads', asset.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from DB
    await Asset.deleteOne({ _id: asset._id });

    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;