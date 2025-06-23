import React from "react";

const AssetViewer = ({ asset, onViewVR }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAssetUrl = () => {
  return `${API_BASE_URL}/uploads/${asset.path}`;
};




  return (
    <div className="asset-viewer">
      <div className="viewer-header">
        <h2>{asset.name}</h2>
        <p>Type: {asset.type}</p>
      </div>

      <div className="viewer-content">
        {asset.type === 'video' ? (
          <video controls style={{ width: '100%', maxHeight: '500px' }}>
            <source src={getAssetUrl()} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="model-container" style={{ width: '100%', height: '100%' }}>
            <iframe
              src={`/vr-viewer.html?model=${encodeURIComponent(getAssetUrl())}`}
              title="3D Model Viewer"
              allow="xr-spatial-tracking"
              allowFullScreen
              style={{ border: 'none', width: '100%', height: '100%' }}
            ></iframe>
          </div>
        )}
      </div>

      {/* {asset.type === 'model' && (
        <div className="viewer-actions">
          <button onClick={onViewVR}>View in VR</button>
        </div>
      )} */}
    </div>
  );
};

export default AssetViewer;
