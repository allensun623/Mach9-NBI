/* eslint-disable react/prop-types */
import { Cartesian3 } from 'cesium';
import { isNil } from 'lodash';
import { useState } from 'react';
import { useCesium } from 'resium';
import {
  useBridgesState,
  useFilterAction,
  useFilterState,
} from '../../../contexts';
import {
  useBridgeData,
  useClusters,
  useFilterPointsByView,
  useGeoJSONPoints,
  useInitializeMinMax,
} from '../../../hooks';
import { calculateHeightFromZoomLevel } from '../../../utils';
import BridgeEntity from './BridgeEntity';

export default function BridgesClusters({ zoomLevel }) {
  const { bridges } = useBridgesState();
  const {
    handleSetDefaultYearRange,
    handleSetDefaultAdtRange,
    handleFilterUpdate,
  } = useFilterAction();
  const filterState = useFilterState();

  const { scene, camera } = useCesium();
  // Flag for initialization status
  const [initialized, setInitialized] = useState(false);
  const [visibleBridgeIds, setVisibleBridgeIds] = useState([]);
  const [clickedId, setClickedId] = useState(0);

  const { bridgesError, areaCodesError } = useBridgeData(
    initialized,
    setInitialized
  );

  // Log errors if fetching data fails
  if (bridgesError || areaCodesError) {
    console.error('Error fetching data:', bridgesError || areaCodesError);
  }

  // Get geoJSON points from filtered bridges
  const geoJSONPoints = useGeoJSONPoints(
    bridges,
    visibleBridgeIds,
    filterState,
    handleFilterUpdate
  );

  // Use clusters hook to get clusters for current zoom level
  const clusters = useClusters(geoJSONPoints, zoomLevel);

  // Filter visible points based on camera view
  useFilterPointsByView(camera, scene, bridges, setVisibleBridgeIds);

  // Initialize Min/Max Year and ADT ranges
  useInitializeMinMax(
    bridges,
    handleSetDefaultYearRange,
    handleSetDefaultAdtRange
  );

  /**
   * Fly the camera to a specific position with a zoom adjustment.
   *
   * @param {Array} position - The [longitude, latitude] coordinates.
   */
  const handleCameraFlyTo = (position) => {
    const cameraHeight = calculateHeightFromZoomLevel(zoomLevel + 1); // Adjust zoom level by 1
    const destination = Cartesian3.fromDegrees(...position, cameraHeight);

    // Fly the camera to the new destination with a 2-second animation duration
    camera.flyTo({ destination, duration: 2 });
  };

  const handleClick = ({ isCluster, clusterPosition, bridgeId }) => {
    // Set bridge entity ID
    if (isNil(isCluster) && bridgeId) {
      setClickedId(bridgeId);
      return;
    }
    // Handle cluster clicks to zoom into the cluster location
    if (!clusterPosition) {
      console.warn('Invalid cluster position:', clusterPosition);
      return;
    }
    // Fly the camera to the cluster position
    handleCameraFlyTo(clusterPosition);
  };

  const getBridgeById = (id) => (clickedId === id ? bridges[clickedId] : null);

  return (
    <>
      {clusters.map((cluster, i) => (
        <BridgeEntity
          key={i}
          cluster={cluster}
          onClick={handleClick}
          bridge={getBridgeById(cluster.properties?.id)}
        />
      ))}
    </>
  );
}
