import { useFilterAction, useFilterState } from '../../context/FilterContext';
import Slider from './Slider';

export default function YearSlider() {
  const { handleSetCurrentYearRange } = useFilterAction();
  const { currentYearRange, defaultYearRange } = useFilterState();

  return (
    <Slider
      currentRange={currentYearRange}
      defaultRange={defaultYearRange}
      handleSetCurrentRange={handleSetCurrentYearRange}
    />
  );
}
