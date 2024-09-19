import { createContext, useContext, useState } from 'react';

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
  const [bridges, setBridges] = useState([]);

  const handleUpdateBridges = (values) => setBridges(values);

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
