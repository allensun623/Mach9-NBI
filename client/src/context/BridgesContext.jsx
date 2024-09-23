import { pick } from 'lodash';
import { createContext, useContext, useState } from 'react';
import {
  convertArrayObjectToSingleObject,
  getCartesian3Position,
  getColorFromPixelSize,
  pixelSizeBasedOnADT,
} from '../utils';
import { useFilterState } from './FilterContext';

const BridgesStateContext = createContext();
const BridgesActionContext = createContext();

export function useBridgesState() {
  const context = useContext(BridgesStateContext);
  if (!context) {
    throw new Error(
      'useBridgesState must be used within a BridgesContextProvider'
    );
  }
  return context;
}

export function useBridgesAction() {
  const context = useContext(BridgesActionContext);
  if (!context) {
    throw new Error(
      'useBridgesAction must be used within a BridgesContextProvider'
    );
  }
  return context;
}

// eslint-disable-next-line react/prop-types
export function BridgesContextProvider({ children }) {
  const { functionalClassificationCodes: fcc } = useFilterState();
  const [bridges, setBridges] = useState({});

  const handleUpdateBridges = (values) => {
    const fccOjb = convertArrayObjectToSingleObject(fcc, 'code');
    const updatedBridgesArray = values.map((b) => {
      const position = getCartesian3Position(
        pick(b, ['longitude', 'latitude'])
      );
      const pixelSize = pixelSizeBasedOnADT(b.adt);
      const color = getColorFromPixelSize(pixelSize);
      const areaType =
        fccOjb[b.functionalClassificationCode]?.name || 'unknown';

      return {
        ...b,
        position,
        pixelSize,
        color,
        areaType,
      };
    });
    // reduce an array of objects, and the id is used as the key: e.x. {id: bridge}
    const bridgesObt = updatedBridgesArray.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    setBridges(bridgesObt);
  };

  const BridgesState = { bridges };
  const BridgesAction = { handleUpdateBridges };

  return (
    <BridgesStateContext.Provider value={BridgesState}>
      <BridgesActionContext.Provider value={BridgesAction}>
        {children}
      </BridgesActionContext.Provider>
    </BridgesStateContext.Provider>
  );
}
