import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AssetViewer from './components/AssetViewer';
import VRViewer from './components/VRViewer';
import './styles.css';
import React from 'react';
import axios from 'axios';
function App() {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showVR, setShowVR] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
  try {
    const response = await axios.get('https://192.168.1.27:5000/api/assets');
    setAssets(response.data);
    
  } catch (error) {
    console.error('Error fetching assets:', error);
    
    // Axios wraps the error response in error.response
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    setAssets([]);
  }
};



  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setShowVR(false);
  };

  const handleUploadSuccess = () => {
    fetchAssets();
  };

  return (
    <div className="app-container">
      <Sidebar 
        assets={assets} 
        onSelect={handleAssetSelect} 
        onUploadSuccess={handleUploadSuccess}
      />
      <div className="main-content">
        
        {selectedAsset ? (
          showVR ? (
            <VRViewer asset={selectedAsset} onBack={() => setShowVR(false)} />
          ) : (
            <AssetViewer asset={selectedAsset} onViewVR={() => setShowVR(true)} />
          )
        ) : (
          <div className="empty-state">
            <h2>Welcome to VR Viewer</h2>
            <p>Select an asset from the sidebar or upload a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;