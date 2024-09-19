import CesiumMap from './CesiumMap';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return <MainLayout content={<CesiumMap />} sider={'sider'} />;
}

/**

import {
  Cartesian3,
  Math as CesiumMath,
  createOsmBuildingsAsync,
} from 'cesium';
import { useEffect, useRef, useState } from 'react';
import {
  CameraFlyTo,
  Entity,
  EntityDescription,
  PointGraphics,
  Viewer,
} from 'resium';

const SF_LON = -122.426433;
const SF_LAT = 37.710634;
const position = Cartesian3.fromDegrees(SF_LON, SF_LAT, 100);
// const position2 = Cartesian3.fromDegrees(-74.0707383, 41, 100);
// Add Cesium OSM Buildings, a global 3D buildings layer.

function App() {
  const cesium = useRef(null);
  const [buildingTileset, setBuildingTileset] = useState();

  useEffect(() => {
    // console.log({ cesium, sceneRef });
    const addBuildingTileset = async () => {
      const tileset = await createOsmBuildingsAsync();
      setBuildingTileset(tileset);
    };

    addBuildingTileset();
  }, []);

  useEffect(() => {
    // if (buildingTileset && cesium.current) {
    //   cesium.current.cesiumElement.scene.primitives.add(buildingTileset);
    // }
  }, [buildingTileset]);

  return (
    <Viewer full ref={cesium}>
      <CameraFlyTo
        destination={Cartesian3.fromDegrees(SF_LON, SF_LAT, 1000)}
        orientation={{
          heading: CesiumMath.toRadians(0.0),
          pitch: CesiumMath.toRadians(-90),
        }}
      />
      <Entity position={position} name='San Francisco'>
        <PointGraphics pixelSize={15} />
        <EntityDescription>
          <h1>Hello, world.</h1>
          <p>JSX is available here!</p>
        </EntityDescription>
      </Entity>
    </Viewer>
  );
}

export default App;

 */
