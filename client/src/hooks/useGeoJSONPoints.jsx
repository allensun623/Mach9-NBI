import { useMemo } from 'react';
import { pickCoordinates } from '../utils';

export const useGeoJSONPoints = (
  bridges,
  visibleBridgeIds,
  filterState,
  handleFilterUpdate
) => {
  return useMemo(() => {
    const filteredBridgeIds = handleFilterUpdate(visibleBridgeIds, bridges);
    return filteredBridgeIds.map((id) => ({
      type: 'Feature',
      properties: { id },
      geometry: { type: 'Point', coordinates: pickCoordinates(bridges[id]) },
    }));
  }, [
    filterState.areaTypeValue,
    filterState.currentAdtRange,
    filterState.currentYearRange,
    filterState.areaCheckedList,
    filterState.currentConditionRange,
    visibleBridgeIds,
  ]);
};
