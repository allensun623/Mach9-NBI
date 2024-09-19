import { BridgesContextProvider } from './BridgesContext';
import { FilterContextProvider } from './FilterContext';

// eslint-disable-next-line react/prop-types
export default function ContextProvider({ children }) {
  return (
    <FilterContextProvider>
      <BridgesContextProvider>{children}</BridgesContextProvider>
    </FilterContextProvider>
  );
}
