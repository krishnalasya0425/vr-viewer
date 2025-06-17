import React from "react";
const VRViewer = ({ asset, onBack }) => {
  const getAssetUrl = () => {
    return `https://192.168.1.27:5000/uploads/${asset.path}`;
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