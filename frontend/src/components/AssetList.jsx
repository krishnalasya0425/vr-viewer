import { useEffect, useState } from 'react';
import axios from 'axios';

const AssetList = ({ assets, onSelect, onUploadSuccess }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return alert("No file selected");

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/assets/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', res.data);
      alert('Upload successful');

      setShowUploadModal(false);
      setFile(null);
      onUploadSuccess(); // refresh list
    } catch (err) {
      if (err.response?.data?.error?.includes('already exists')) {
        setError('File with this name already exists. Please upload with another name.');
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="asset-list-container">
      <div className="asset-list-header">
        <h3>VR Assets</h3>
      </div>

      <div className="asset-items">
        {assets.map((asset) => (
          <div 
            key={asset._id} 
            className="asset-item"
            onClick={() => onSelect(asset)}
          >
            <div className="asset-icon">
              {asset.type === 'video' ? '🎬' : '🖼️'}
            </div>
            <div className="asset-info">
              <div className="asset-name">{asset.name}</div>
              <div className="asset-type">{asset.type}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="asset-list-footer">
        <button 
          className="upload-button"
          onClick={() => setShowUploadModal(true)}
        >
          + Upload Asset
        </button>
      </div>

      {showUploadModal && (
        <div className="upload-modal">
          <div className="modal-content">
            <h4>Upload New Asset</h4>
            <p>Supported formats: .mp4, .glb, .fbx, .obj</p>

            <div className="file-input">
              <input 
                type="file" 
                id="asset-upload"
                onChange={handleFileChange}
                accept=".mp4,.glb,.fbx,.obj"
              />
              <label htmlFor="asset-upload">
                {file ? file.name : 'Choose file...'}
              </label>
            </div>

            {error && <div className="error-message text-red-600">{error}</div>}

            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowUploadModal(false);
                  setFile(null);
                  setError('');
                }}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={handleUpload}
                disabled={uploading || !file}
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

export default AssetList;
