import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import {
  GET_BRIDGES,
  GET_FUNCTIONAL_CLASSIFICATION_CODES,
} from '../apis/queries';
import { useBridgesAction, useFilterAction } from '../contexts';

export const useBridgeData = (initialized, setInitialized) => {
  const { handleUpdateBridges } = useBridgesAction();
  const { handleInitClassificationCodes } = useFilterAction();

  const { data: bridgesData, error: bridgesError } = useQuery(GET_BRIDGES, {
    skip: initialized,
  });
  const { data: areaCodesData, error: areaCodesError } = useQuery(
    GET_FUNCTIONAL_CLASSIFICATION_CODES,
    { skip: initialized }
  );

  useEffect(() => {
    if (initialized || isEmpty(bridgesData) || isEmpty(areaCodesData)) return;

    setInitialized(true);
    handleUpdateBridges(bridgesData.bridges);
    handleInitClassificationCodes(areaCodesData.functionalClassificationCodes);
  }, [
    initialized,
    bridgesData,
    areaCodesData,
    handleUpdateBridges,
    handleInitClassificationCodes,
  ]);

  return { bridgesError, areaCodesError };
};
