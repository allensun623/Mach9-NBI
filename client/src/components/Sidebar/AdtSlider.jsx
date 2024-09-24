import { useFilterAction, useFilterState } from '../../contexts';
import Slider from './Slider';

export default function AdtSlider() {
  const { handleSetCurrentAdtRange } = useFilterAction();
  const { currentAdtRange, defaultAdtRange } = useFilterState();

  return (
    <Slider
      currentRange={currentAdtRange}
      defaultRange={defaultAdtRange}
      handleSetCurrentRange={handleSetCurrentAdtRange}
      step={1000}
    />
  );
}
