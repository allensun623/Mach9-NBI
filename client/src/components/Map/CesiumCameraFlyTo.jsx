import { Cartesian3 } from 'cesium';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { CameraFlyTo } from 'resium';
import { useBridgesState } from '../../contexts';

export default function CesiumCameraFlyTo() {
  const { bridges } = useBridgesState();
  // Track if the camera has finished flying
  const [isCameraReady, setIsCameraReady] = useState(false);
  // start animation of cameraFlyTo
  const shouldLoadCameraFlyTo = !isCameraReady && !isEmpty(bridges);

  return (
    shouldLoadCameraFlyTo && (
      <CameraFlyTo
        destination={Cartesian3.fromDegrees(-77.194527, 40.003323, 5000000)} // Remove underscore
        duration={2}
        onComplete={() => {
          setIsCameraReady(true);
        }}
      />
    )
  );
}
