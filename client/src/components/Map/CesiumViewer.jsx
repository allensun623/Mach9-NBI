import { useState } from 'react';
import { Viewer } from 'resium';
import { calculateZoomAmount, calculateZoomLevel } from '../../utils/zoomUtils';
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

  const handleClusterClick = (isCluster, clusterPosition) => {
    if (!isCluster) return;
    if (!viewer || !clusterPosition) {
      console.warn('Invalid cluster position:', clusterPosition);
      return;
    }
    // Zoom in by a specified amount (you can adjust the amount as needed)
    const zoomAmount = calculateZoomAmount(zoomLevel);
    viewer.camera.zoomIn(zoomAmount);
  };

  return (
    <Viewer fit ref={onViewerReady}>
      <ClusteredMap zoomLevel={zoomLevel} onClusterClick={handleClusterClick} />
    </Viewer>
  );
}
