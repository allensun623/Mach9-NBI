import { isEmpty } from 'lodash';
import { createContext, useContext, useState } from 'react';
import { defaultCheckedList } from '../constants/FunctionalClassificationCodes';

const FilterStateContext = createContext();
const FilterActionContext = createContext();

export function useFilterState() {
  const context = useContext(FilterStateContext);
  if (!context) {
    throw new Error(
      'useFilterState must be used within a FilterContextProvider'
    );
  }
  return context;
}

export function useFilterAction() {
  const context = useContext(FilterActionContext);
  if (!context) {
    throw new Error(
      'useFilterAction must be used within a FilterContextProvider'
    );
  }
  return context;
}

// eslint-disable-next-line react/prop-types
export function FilterContextProvider({ children }) {
  const [currentYearRange, setCurrentYearRange] = useState([]);
  const [defaultYearRange, setDefaultYearRange] = useState([]);
  const [currentAdtRange, setCurrentAdtRange] = useState([]);
  const [defaultAdtRange, setDefaultAdtRange] = useState([]);
  const [areaTypeValue, setAreaTypeValue] = useState(0);
  const [areaCheckedList, setAreaCheckedList] = useState(defaultCheckedList);

  const handleSetCurrentYearRange = (values) => {
    setCurrentYearRange(values);
  };
  const handleSetDefaultYearRange = (values) => {
    setDefaultYearRange(values);
    handleSetCurrentYearRange(values);
  };

  const handleSetCurrentAdtRange = (values) => {
    setCurrentAdtRange(values);
  };
  const handleSetDefaultAdtRange = (values) => {
    setDefaultAdtRange(values);
    handleSetCurrentAdtRange(values);
  };

  const handleAreaTypeSelect = (v) => setAreaTypeValue(v);

  const handleCheckChange = (list) => setAreaCheckedList(list);
  const handleCheckAllChange = (e) =>
    setAreaCheckedList(e.target.checked ? defaultCheckedList : []);

  const handleResetFilterState = () => {
    setCurrentYearRange(defaultYearRange); // Reset current year slider to default
    setCurrentAdtRange(defaultAdtRange); // Reset current ADT slider to default
    setAreaTypeValue(0); // Reset area type filter
    setAreaCheckedList(defaultCheckedList);
  };

  const handleFilterByYear = (bridges) => {
    if (isEmpty(currentYearRange)) return [];

    const [min, max] = currentYearRange;
    return bridges.filter((b) => {
      const year = b.yearReconstructed || b.yearBuilt;
      return min <= year && year <= max;
    });
  };

  const handleFilterByAreaType = (bridges) => {
    // code {0: all, 1: rural: [1, 9], urban: [10, 19]}
    switch (areaTypeValue) {
      case 1:
        return bridges.filter((b) => b.functionalClassificationCode <= 9);
      case 2:
        return bridges.filter((b) => b.functionalClassificationCode > 9);
      default:
        return bridges;
    }
  };

  const handleFilterByAdt = (bridges) => {
    if (isEmpty(currentAdtRange)) return [];

    const [min, max] = currentAdtRange;
    return bridges.filter((b) => min <= b.adt && b.adt <= max);
  };

  const handleFilterAreaCode = (bridges) => {
    const areaCheckedSet = new Set(areaCheckedList.map((a) => parseInt(a)));
    // console.log({ areaCheckedList, areaCheckedSet });
    return bridges.filter((b) =>
      areaCheckedSet.has(b.functionalClassificationCode)
    );
  };

  const handleFilterUpdate = (bridges) => {
    let filteredBridges = [...bridges];
    filteredBridges = handleFilterByAreaType(filteredBridges);
    filteredBridges = handleFilterByYear(filteredBridges);
    filteredBridges = handleFilterByAdt(filteredBridges);
    filteredBridges = handleFilterAreaCode(filteredBridges);

    return filteredBridges;
  };

  const FilterState = {
    currentYearRange,
    defaultYearRange,
    currentAdtRange,
    defaultAdtRange,
    areaTypeValue,
    areaCheckedList,
  };

  const FilterAction = {
    handleSetCurrentYearRange,
    handleSetDefaultYearRange,
    handleSetCurrentAdtRange,
    handleSetDefaultAdtRange,
    handleAreaTypeSelect,
    handleFilterUpdate,
    handleCheckChange,
    handleCheckAllChange,
    handleResetFilterState,
  };

  return (
    <FilterStateContext.Provider value={FilterState}>
      <FilterActionContext.Provider value={FilterAction}>
        {children}
      </FilterActionContext.Provider>
    </FilterStateContext.Provider>
  );
}
