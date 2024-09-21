import { createContext, useContext, useState } from 'react';
import {
  convertArrayObjectToSingleObject,
  getCartesian3Position,
  getColorFromPixelSize,
  pixelSizeBasedOnADT,
} from '../utils/map';
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
  const [bridges, setBridges] = useState([]);

  const handleUpdateBridges = (values) => {
    const fccOjb = convertArrayObjectToSingleObject(fcc, 'code');
    const rawBridges = [...values];
    const updatedBridges = rawBridges.map((b) => {
      const position = getCartesian3Position({
        longitude: b.longitude,
        latitude: b.latitude,
      });
      const pixelSize = pixelSizeBasedOnADT(b.adt);
      const color = getColorFromPixelSize(pixelSize);
      const areaType = fccOjb[b.functionalClassificationCode]?.name || 'known';

      return {
        ...b,
        position,
        pixelSize,
        color,
        areaType,
      };
    });

    setBridges(updatedBridges);
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
