import { Cartesian3, Math as CesiumMath } from 'cesium';
import { CameraFlyTo } from 'resium';

const LAT = 40.003323;
const LON = -77.194527;

export default function CesiumCameraFlyTo() {
  return (
    <CameraFlyTo
      destination={Cartesian3.fromDegrees(LON, LAT, 500_000)}
      orientation={{
        heading: CesiumMath.toRadians(0.0),
        pitch: CesiumMath.toRadians(-90),
      }}
    />
  );
}
