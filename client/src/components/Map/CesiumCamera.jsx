/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { Camera } from 'resium';
import { calculateZoomLevel } from '../../utils/zoomUtils';

export default function CesiumCamera({
  handleInitCamera,
  handleUpdateZoomLevel,
}) {
  const cameraRef = useRef(null);

  const handleCameraChange = () => {
    if (!cameraRef.current || !cameraRef.current.cesiumElement) return;

    const newZoomLevel = calculateZoomLevel(
      cameraRef.current.cesiumElement.positionCartographic.height
    );
    handleUpdateZoomLevel(newZoomLevel);
  };

  // Polling for cesiumElement: I added a polling mechanism using setInterval to check every 100ms if cameraRef.current.cesiumElement is initialized.
  // Once it's available, we clear the interval and proceed with initializing the camera.
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cameraRef.current?.cesiumElement) {
        console.log('Camera initialized');
        const camera = cameraRef.current.cesiumElement;
        camera.changed.addEventListener(handleCameraChange); // init and add listener
        handleInitCamera(camera);

        clearInterval(intervalId); // Stop checking once it's initialized
      }
    }, 100); // Check every 100ms

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return <Camera ref={cameraRef} />;
}
