/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { Camera, useCesium } from 'resium';
import { calculateZoomLevel } from '../../utils';

export default function CesiumCamera({ handleUpdateZoomLevel }) {
  const { camera } = useCesium();

  useEffect(() => {
    const handleCameraChange = () => {
      const cameraHeight = camera.positionCartographic.height;
      const newZoomLevel = calculateZoomLevel(cameraHeight);
      handleUpdateZoomLevel(newZoomLevel);
    };

    camera.changed.addEventListener(handleCameraChange); // init and add listener
  }, []);

  return <Camera />;
}
