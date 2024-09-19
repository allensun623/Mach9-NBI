import { BridgesContextProvider } from './BridgesContext';
import { FilterContextProvider } from './FilterContext';

// eslint-disable-next-line react/prop-types
export default function ContextProvider({ children }) {
  return (
    <BridgesContextProvider>
      <FilterContextProvider>{children}</FilterContextProvider>
    </BridgesContextProvider>
  );
}
