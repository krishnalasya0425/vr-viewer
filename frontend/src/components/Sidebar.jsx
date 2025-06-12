import { useState } from 'react';
import axios from 'axios';
import React from 'react';

const Sidebar = ({ assets, onSelect, onUploadSuccess }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await axios.post('/api/assets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowUploadModal(false);
      setFile(null);
      onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>VR Assets</h2>
      </div>
      <div className="asset-list">
        {assets.map((asset) => (
          <div 
            key={asset._id} 
            className="asset-item"
            onClick={() => onSelect(asset)}
          >
            <div className="asset-icon">
              {asset.type === 'video' ? '🎬' : '🖼️'}
            </div>
            <div className="asset-name">{asset.name}</div>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <button 
          className="upload-button"
          onClick={() => setShowUploadModal(true)}
        >
          Upload Asset
        </button>
      </div>

      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Upload Asset</h3>
            <p>Supported formats: MP4, GLB, FBX, OBJ</p>
            <input type="file" onChange={handleFileChange} accept=".mp4,.glb,.fbx,.obj" />
            {error && <div className="error-message">{error}</div>}
            <div className="modal-actions">
              <button onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button 
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 