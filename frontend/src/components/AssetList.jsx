import { useEffect, useState } from 'react';
import axios from 'axios';

const AssetList = ({ assets, onSelect, onUploadSuccess }) => {
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

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowUploadModal(false)}
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