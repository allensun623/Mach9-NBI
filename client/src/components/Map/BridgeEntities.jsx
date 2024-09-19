import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { GET_BRIDGES } from '../../apis/queries/bridges';
import { GET_FUNCTIONAL_CLASSIFICATION_CODES } from '../../apis/queries/functionalClassificationCodes';
import {
  useBridgesAction,
  useBridgesState,
} from '../../context/BridgesContext';
import { useFilterAction, useFilterState } from '../../context/FilterContext';
import { getMinMax } from '../../utils/map';
import BridgeEntity from './BridgeEntity';

const getMinMaxYears = (bridges) => {
  const years = bridges.map((b) => b?.yearReconstructed || b?.yearBuilt);
  return getMinMax(years);
};

const getMinMaxAdts = (bridges) => {
  const adts = bridges.map((b) => b?.adt || 0);
  return getMinMax(adts);
};

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
  const { currentYearRange, currentAdtRange, areaTypeValue, areaCheckedList } =
    filterState;

  // State to track whether queries have been initialized
  const [initialized, setInitialized] = useState(false);

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
    if (bridgesData) handleUpdateBridges(bridgesData.bridges.slice(0, 1000));
  }, [bridgesData]);

  useEffect(() => {
    if (areaCodesData)
      handleInitClassificationCodes(
        areaCodesData.functionalClassificationCodes
      );
  }, [areaCodesData]);

  const filteredBridges = useMemo(
    () => handleFilterUpdate(bridges),
    [areaTypeValue, currentAdtRange, currentYearRange, areaCheckedList, bridges]
  );

  // Initialize min & max years and ADTs
  useEffect(() => {
    if (bridges.length > 0) {
      const minMaxYear = getMinMaxYears(bridges);
      const minMaxAdt = getMinMaxAdts(bridges);
      handleSetDefaultYearRange(minMaxYear);
      handleSetDefaultAdtRange(minMaxAdt);
    }
  }, [bridges]);

  if (bridgesError || areaCodesError) {
    console.error('Error fetching data:', bridgesError || areaCodesError);
  }

  return (
    <>
      {filteredBridges.map((b, i) => (
        <BridgeEntity key={i} {...b} />
      ))}
    </>
  );
}
