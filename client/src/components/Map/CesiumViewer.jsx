import { useState } from 'react';
import { Viewer } from 'resium';
import { calculateZoomLevel } from '../../utils/index';
import ClusteredMap from './ClusteredMap';

export default function CesiumViewer() {
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
    <Viewer fit ref={onViewerReady}>
      <ClusteredMap zoomLevel={zoomLevel} viewer={viewer} />
    </Viewer>
  );
}
