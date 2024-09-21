import { Cartesian3, Math as CesiumMath } from 'cesium';
import { CameraFlyTo, Viewer } from 'resium';
// import StateMap from './StateMap';
import { theme } from 'antd';
import BridgeEntities from './BridgeEntities';

export default function CesiumMap() {
  const LAT = 40.003323;
  const LON = -77.194527;

  const { token } = theme.useToken();
  const mapStyle = {
    marginBottom: 4,
    background: token.colorFillAlter,
    // background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    border: 'none',
    width: '100%',
    padding: token.paddingSM,
  };

  return (
    <Viewer style={mapStyle}>
      <CameraFlyTo
        destination={Cartesian3.fromDegrees(LON, LAT, 500_000)}
        orientation={{
          heading: CesiumMath.toRadians(0.0),
          pitch: CesiumMath.toRadians(-90),
        }}
      />
      <BridgeEntities />
    </Viewer>
  );
}
