import { Checkbox, Divider } from 'antd';
import { areaOptions } from '../../constants/FunctionalClassificationCodes';
import { useFilterAction, useFilterState } from '../../context/FilterContext';

export default function AreaClassificationCheckbox() {
  const { areaCheckedList } = useFilterState();
  const { handleCheckChange, handleCheckAllChange } = useFilterAction();

  const checkAll = areaOptions.length === areaCheckedList.length;
  const indeterminate = areaCheckedList.length < areaOptions.length;

  return (
    <>
      <Checkbox
        indeterminate={indeterminate}
        onChange={handleCheckAllChange}
        checked={checkAll}
      >
        All
      </Checkbox>
      <Divider />
      <Checkbox.Group
        options={areaOptions}
        value={areaCheckedList}
        onChange={handleCheckChange}
      />
    </>
  );
}
