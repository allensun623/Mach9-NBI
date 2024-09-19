import { useEffect, useMemo } from 'react';
import { bridgesPartials } from './assets/dataset/bridges';
import BridgeEntity from './BridgeEntity';
import { useFilterAction, useFilterState } from './context/FilterContext';
import { getMinMax } from './utils/map';

const getMinMaxYears = (bridges) => {
  // priority: yearReconstructed (not null or 0) > yearBuilt
  const years = bridges.map((b) => b?.yearReconstructed || b?.yearBuilt);
  return getMinMax(years);
};

const getMinMaxAdts = (bridges) => {
  const adts = bridges.map((b) => b?.adt || 0);
  return getMinMax(adts);
};

export default function StateEntities() {
  const {
    handleSetDefaultYearRange,
    handleSetDefaultAdtRange,
    handleFilterUpdate,
  } = useFilterAction();
  const filterState = useFilterState();
  const { currentYearRange, currentAdtRange, areaTypeValue, areaCheckedList } =
    filterState;

  const bridges = useMemo(() => bridgesPartials(1000), []);
  const filteredBridges = useMemo(
    () => handleFilterUpdate(bridges),
    [areaTypeValue, currentAdtRange, currentYearRange, areaCheckedList]
  );

  // initialize min & max years
  useEffect(() => {
    const minMaxYear = getMinMaxYears(bridges);
    const minMaxAdt = getMinMaxAdts(bridges);
    handleSetDefaultYearRange(minMaxYear);
    handleSetDefaultAdtRange(minMaxAdt);
  }, [bridges]);

  return (
    <>
      {filteredBridges.map((b, i) => (
        <BridgeEntity key={i} {...b} />
      ))}
    </>
  );
}
