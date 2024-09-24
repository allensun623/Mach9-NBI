import { BRIDGE_CONDITION_TYPE } from '../../constants/constants';
import { useFilterAction, useFilterState } from '../../contexts';
import Slider from './Slider';

export default function BridgeConditionSlider() {
  const { handleSetConditionRange } = useFilterAction();
  const { currentConditionRange, defaultConditionRange } = useFilterState();

  const conditionSlides = Object.values(BRIDGE_CONDITION_TYPE).map((type) => (
    <div key={type}>
      <p style={{ textTransform: 'capitalize' }}>{type}</p>
      <Slider
        currentRange={currentConditionRange[type]}
        defaultRange={defaultConditionRange}
        handleSetCurrentRange={(v) => handleSetConditionRange(v, type)}
      />
    </div>
  ));
  return conditionSlides;
}
