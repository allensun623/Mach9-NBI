/* eslint-disable react/prop-types */
import { Slider as AntdSlider } from 'antd';

export default function Slider({
  currentRange,
  defaultRange,
  handleSetCurrentRange,
  step = 1,
}) {
  const [min, max] = defaultRange;
  const marks = {
    [min]: min,
    [max]: max,
  };
  return (
    <AntdSlider
      range={{
        draggableTrack: true,
      }}
      marks={marks}
      min={min} // Set the custom min value
      max={max} // Set the custom max value
      defaultValue={defaultRange} // Default slider position
      value={currentRange} // Current value of the slider
      onChange={handleSetCurrentRange} // Function to update value on change
      step={step}
    />
  );
}
