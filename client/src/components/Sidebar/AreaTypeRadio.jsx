import { Radio, Space } from 'antd';
import { useFilterAction, useFilterState } from '../../context/FilterContext';

export default function AreaTypeRadio() {
  const { areaTypeValue } = useFilterState();
  const { handleAreaTypeSelect } = useFilterAction();
  const onChange = (e) => handleAreaTypeSelect(e.target.value);
  return (
    <Radio.Group onChange={onChange} value={areaTypeValue}>
      <Space direction='vertical'>
        <Radio value={0}>(All)</Radio>
        <Radio value={1}>Rural</Radio>
        <Radio value={2}>Urban</Radio>
      </Space>
    </Radio.Group>
  );
}
