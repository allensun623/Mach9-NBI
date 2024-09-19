import {
  Cartesian3,
  Math as CesiumMath,
  createOsmBuildingsAsync,
} from 'cesium';
import { useEffect, useRef, useState } from 'react';
import { CameraFlyTo, Scene, Viewer } from 'resium';
// import StateMap from './StateMap';
import { theme } from 'antd';
import StateMap from './StateMap';

export default function CesiumMap() {
  const LAT = 40.003323;
  const LON = -77.194527;

  // const cesium = useRef(null);
  const sceneRef = useRef(null);
  const [buildingTileset, setBuildingTileset] = useState();

  useEffect(() => {
    const addBuildingTileset = async () => {
      const tileset = await createOsmBuildingsAsync();
      setBuildingTileset(tileset);
    };

    addBuildingTileset();
  }, []);

  useEffect(() => {
    // sceneRef.current?.cesiumElement?.primitives.add(buildingTileset);
  }, [buildingTileset]);
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
    // <Viewer full>
    <Viewer style={mapStyle}>
      <CameraFlyTo
        destination={Cartesian3.fromDegrees(LON, LAT, 500_000)}
        orientation={{
          heading: CesiumMath.toRadians(0.0),
          pitch: CesiumMath.toRadians(-90),
        }}
      />
      <Scene ref={sceneRef} />
      <StateMap />
    </Viewer>
  );
}
