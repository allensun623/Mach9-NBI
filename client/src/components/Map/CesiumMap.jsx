import { theme } from 'antd';
import { useState } from 'react';
import { Viewer } from 'resium';
import { calculateZoomLevel } from '../../utils/zoomUtils';
import BridgesEntities from './BridgeEntities';
import CesiumCameraFlyTo from './CesiumCameraFlyTo';

const mapStyle = (token) => ({
  marginBottom: 4,
  background: token.colorFillAlter,
  borderRadius: token.borderRadiusLG,
  border: 'none',
  width: '100%',
  padding: token.paddingSM,
});

export default function CesiumViewer() {
  const { token } = theme.useToken();
  const [viewer, setViewer] = useState(null); // State for the viewer instance
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleCameraChange = () => {
    if (!viewer) return;
    const cameraHeight = viewer.camera.positionCartographic.height;
    const newZoomLevel = calculateZoomLevel(cameraHeight);
    setZoomLevel(newZoomLevel);
  };

  const onViewerReady = (cesiumViewer) => {
    if (!cesiumViewer?.cesiumElement) return;
    const { cesiumElement } = cesiumViewer;
    setViewer(cesiumElement);

    // Add event listener for camera changes
    cesiumElement.camera.changed.addEventListener(handleCameraChange);

    // Initialize zoom level on load
    handleCameraChange();
  };

  return (
    <Viewer ref={onViewerReady} style={mapStyle(token)}>
      <CesiumCameraFlyTo />
      <BridgesEntities zoomLevel={zoomLevel} viewer={viewer} />
    </Viewer>
  );
}
