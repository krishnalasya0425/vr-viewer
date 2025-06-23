import React from "react";
const VRViewer = ({ asset, onBack }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getAssetUrl = () => {
    return `${API_BASE_URL}/uploads/${asset.path}`;
  };

  return (
    <div className="vr-viewer">
      <div className="vr-header">
        <button onClick={onBack}>Back to Viewer</button>
        <h2>{asset.name} - VR Mode</h2>
      </div>
      <iframe 
        src={`/vr-viewer.html?model=${encodeURIComponent(getAssetUrl())}`}
        title="VR Viewer"
        allow="xr-spatial-tracking"
      ></iframe>
    </div>
  );
};

export default VRViewer;