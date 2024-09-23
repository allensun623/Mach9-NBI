import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { getMinMaxAdts, getMinMaxYears } from '../utils';

export const useInitializeMinMax = (
  bridges,
  handleSetDefaultYearRange,
  handleSetDefaultAdtRange
) => {
  const [initializedMinMax, setInitializedMinMax] = useState(false);

  useEffect(() => {
    if (isEmpty(bridges) || initializedMinMax) return;

    const minMaxYear = getMinMaxYears(bridges); // Calculate min/max year
    const minMaxAdt = getMinMaxAdts(bridges); // Calculate min/max ADT
    handleSetDefaultYearRange(minMaxYear); // Set default year range
    handleSetDefaultAdtRange(minMaxAdt); // Set default ADT range
    setInitializedMinMax(true); // Mark min/max initialization complete
  }, [
    bridges,
    initializedMinMax,
    handleSetDefaultYearRange,
    handleSetDefaultAdtRange,
  ]);

  return initializedMinMax;
};
