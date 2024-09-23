import { Cartesian3 } from 'cesium';
import { useState } from 'react';
import { CameraFlyTo } from 'resium';

export default function CesiumCameraFlyTo() {
  const [isCameraReady, setIsCameraReady] = useState(false); // Track if the camera has finished flying

  return isCameraReady ? null : (
    <CameraFlyTo
      destination={Cartesian3.fromDegrees(-77.194527, 40.003323, 5000000)} // Remove underscore
      duration={2}
      onComplete={() => {
        setIsCameraReady(true);
      }}
    />
  );
}
