import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { GET_BRIDGES } from '../../apis/queries/bridges';
import { GET_FUNCTIONAL_CLASSIFICATION_CODES } from '../../apis/queries/functionalClassificationCodes';
import {
  useBridgesAction,
  useBridgesState,
} from '../../context/BridgesContext';
import { useFilterAction, useFilterState } from '../../context/FilterContext';
import { getMinMaxAdts, getMinMaxYears } from '../../utils/map';
import BridgeCluster from './BridgeCluster';
import BridgeEntity from './BridgeEntity';

export default function StateEntities() {
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

  // State to track whether queries have been initialized
  const [initialized, setInitialized] = useState(false);
  const [initializedMinMax, setInitializedMinMax] = useState(false);

  // Fetch bridges and area codes only on initial load
  const { data: bridgesData, error: bridgesError } = useQuery(GET_BRIDGES, {
    skip: initialized,
  });
  const { data: areaCodesData, error: areaCodesError } = useQuery(
    GET_FUNCTIONAL_CLASSIFICATION_CODES,
    { skip: initialized }
  );

  // Call the queries once during component initialization
  useEffect(() => {
    if (!initialized && bridgesData && areaCodesData) setInitialized(true);
  }, [initialized]);

  useEffect(() => {
    if (bridgesData) handleUpdateBridges(bridgesData.bridges);
  }, [bridgesData]);

  useEffect(() => {
    if (areaCodesData)
      handleInitClassificationCodes(
        areaCodesData.functionalClassificationCodes
      );
  }, [areaCodesData]);

  const filteredBridges = useMemo(
    () => handleFilterUpdate(bridges),
    [
      areaTypeValue,
      currentAdtRange,
      currentYearRange,
      areaCheckedList,
      currentConditionRange,
      bridges,
    ]
  );

  // Initialize min & max years and ADTs
  useEffect(() => {
    if (bridges.length > 0 && !initializedMinMax) {
      const minMaxYear = getMinMaxYears(bridges);
      const minMaxAdt = getMinMaxAdts(bridges);
      handleSetDefaultYearRange(minMaxYear);
      handleSetDefaultAdtRange(minMaxAdt);
      setInitializedMinMax(false);
    }
  }, [bridges]);

  if (bridgesError || areaCodesError) {
    console.error('Error fetching data:', bridgesError || areaCodesError);
  }

  return (
    <BridgeCluster>
      {filteredBridges.map((b, i) => (
        <BridgeEntity key={i} {...b} />
      ))}
    </BridgeCluster>
  );
}
