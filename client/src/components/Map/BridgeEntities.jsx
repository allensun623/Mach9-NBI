/* eslint-disable react/prop-types */
import { useQuery } from '@apollo/client';
import { pick } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import Supercluster from 'supercluster';
import {
  GET_BRIDGES,
  GET_FUNCTIONAL_CLASSIFICATION_CODES,
} from '../../apis/queries';
import {
  useBridgesAction,
  useBridgesState,
} from '../../context/BridgesContext';
import { useFilterAction, useFilterState } from '../../context/FilterContext';
import {
  convertCoordinates,
  getMinMaxAdts,
  getMinMaxYears,
} from '../../utils/bridgeUtils';
import { calculateZoomAmount } from '../../utils/zoomUtils';
import BridgeEntity from './BridgeEntity';

export default function BridgesEntities({ zoomLevel, viewer }) {
  const { handleUpdateBridges } = useBridgesAction();
  const { bridges } = useBridgesState();

  const {
    handleSetDefaultYearRange,
    handleSetDefaultAdtRange,
    handleFilterUpdate,
    handleInitClassificationCodes,
  } = useFilterAction();

  const filterState = useFilterState();
  const {
    areaCheckedList,
    areaTypeValue,
    currentAdtRange,
    currentYearRange,
    currentConditionRange,
  } = filterState;

  // Flag for initialization status
  const [initialized, setInitialized] = useState(false);
  const [initializedMinMax, setInitializedMinMax] = useState(false);
  const [clusters, setClusters] = useState([]);

  // Fetch data for bridges and classification codes
  const { data: bridgesData, error: bridgesError } = useQuery(GET_BRIDGES, {
    skip: initialized, // Skip query once initialized
  });
  const { data: areaCodesData, error: areaCodesError } = useQuery(
    GET_FUNCTIONAL_CLASSIFICATION_CODES,
    { skip: initialized }
  );

  // Memoize the cluster object to avoid recreating on every render
  const cluster = useMemo(
    () => new Supercluster({ radius: 40, maxZoom: 16 }),
    [] // Dependencies empty to ensure it's only created once
  );

  // Filter bridges based on current filter settings
  const filteredBridges = useMemo(
    () => handleFilterUpdate(bridges),
    [
      areaTypeValue,
      currentAdtRange,
      currentYearRange,
      areaCheckedList,
      currentConditionRange,
      bridges, // Dependencies ensure this recalculates only when necessary
    ]
  );

  // Map filtered bridges to GeoJSON format
  const geoJSONPoints = useMemo(
    () =>
      filteredBridges.map((point, i) => ({
        type: 'Feature',
        properties: { id: i }, // Each bridge gets a unique id
        geometry: {
          type: 'Point',
          coordinates: convertCoordinates(
            pick(point, ['longitude', 'latitude'])
          ),
        },
      })),
    [filteredBridges]
  );

  // Initialize bridges and classification codes when data is available
  useEffect(() => {
    if (!initialized && bridgesData && areaCodesData) {
      setInitialized(true);
      handleUpdateBridges(bridgesData.bridges); // Update bridge data
      handleInitClassificationCodes(
        areaCodesData.functionalClassificationCodes
      ); // Initialize classification codes
    }
  }, [
    initialized,
    bridgesData,
    areaCodesData,
    handleUpdateBridges,
    handleInitClassificationCodes,
  ]);

  // Load clusters whenever zoom level or filtered bridges change
  useEffect(() => {
    if (zoomLevel && geoJSONPoints.length) {
      const bounds = [-180, -85, 180, 85]; // World bounds
      cluster.load(geoJSONPoints); // Load points into the cluster
      const clusterData = cluster.getClusters(bounds, zoomLevel); // Get clusters for the current zoom level
      setClusters(clusterData); // Set the clusters state
    }
  }, [zoomLevel, geoJSONPoints, cluster]);

  // Set default year range and ADT (Average Daily Traffic) range
  useEffect(() => {
    if (bridges.length > 0 && !initializedMinMax) {
      const minMaxYear = getMinMaxYears(bridges); // Calculate min/max year
      const minMaxAdt = getMinMaxAdts(bridges); // Calculate min/max ADT
      handleSetDefaultYearRange(minMaxYear); // Set default year range
      handleSetDefaultAdtRange(minMaxAdt); // Set default ADT range
      setInitializedMinMax(true); // Mark min/max initialization complete
    }
  }, [
    bridges,
    initializedMinMax,
    handleSetDefaultYearRange,
    handleSetDefaultAdtRange,
  ]);

  // Handle cluster clicks to zoom into the cluster location
  const handleClusterClick = (isCluster, clusterPosition) => {
    if (!isCluster || !viewer || !clusterPosition) {
      console.warn('Invalid cluster position:', clusterPosition);
      return;
    }
    const zoomAmount = calculateZoomAmount(zoomLevel); // Calculate zoom based on current zoom level
    viewer.camera.zoomIn(zoomAmount); // Zoom in to the cluster
  };

  // Log errors if fetching data fails
  if (bridgesError || areaCodesError) {
    console.error('Error fetching data:', bridgesError || areaCodesError);
  }

  return (
    <>
      {clusters.map((cluster, i) => (
        <BridgeEntity
          key={i} // Ensure unique keys for React list items
          cluster={cluster}
          onClusterClick={handleClusterClick} // Handle cluster click event
        />
      ))}
    </>
  );
}
