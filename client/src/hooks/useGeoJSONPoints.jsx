import { useMemo } from 'react';
import { pickCoordinates } from '../utils';

// Custom hook for generating GeoJSON Point features from bridges data
export const useGeoJSONPoints = (
  bridges,
  visibleBridgeIds,
  filterState,
  handleFilterUpdate
) => {
  // An array of feature objects.
  // A feature object which contains a geometry and associated properties.
  // https://tools.ietf.org/html/rfc7946#section-3.2
  const geoJSONPoints = useMemo(() => {
    const filteredBridgeIds = handleFilterUpdate(visibleBridgeIds, bridges);
    const geoPoints = filteredBridgeIds.map((id) => ({
      type: 'Feature',
      properties: { id },
      geometry: { type: 'Point', coordinates: pickCoordinates(bridges[id]) },
    }));
    return geoPoints;
  }, [
    filterState.areaTypeValue,
    filterState.currentAdtRange,
    filterState.currentYearRange,
    filterState.areaCheckedList,
    filterState.currentConditionRange,
    visibleBridgeIds,
  ]);

  return geoJSONPoints;
};
