import { InfoCircleOutlined } from '@ant-design/icons';
import { Collapse as AntdCollapse, Button, theme, Tooltip } from 'antd';
import AdtSlider from './AdtSlider';
import AreaClassificationCheckbox from './AreaClassificationCheckbox';
import AreaTypeRadio from './AreaTypeRadio';
import BridgeConditionSlider from './BridgeConditionSlider';
import YearSlider from './YearSlider';

// eslint-disable-next-line react/prop-types
const Label = ({ label, title }) => (
  <>
    {label}
    <Tooltip title={title}>
      <Button
        type='text'
        icon={<InfoCircleOutlined />}
        size='small'
        style={{ marginLeft: 8 }}
      />
    </Tooltip>
  </>
);

const getItems = (panelStyle) => [
  {
    key: '1',
    label: (
      <Label
        label={'Area Type'}
        title={'Select the classification for the area'}
      />
    ),
    children: <AreaTypeRadio />,
    style: panelStyle,
  },
  {
    key: '2',
    label: (
      <Label
        label={'Area Classification'}
        title={'Select the classification for the area'}
      />
    ),
    children: <AreaClassificationCheckbox />,
    style: panelStyle,
  },
  {
    key: '3',
    label: (
      <Label
        label={'Average Daily Traffic'}
        title={'Set the average daily traffic volume for the bridge'}
      />
    ),
    children: <AdtSlider />,
    style: panelStyle,
  },
  {
    key: '4',
    label: (
      <Label
        label={'Year Built/Rebuilt'}
        title={'Specify the year the bridge was built or rebuilt'}
      />
    ),
    children: <YearSlider />,
    style: panelStyle,
  },
  {
    key: '5',
    label: (
      <Label
        label={'Conditions'}
        title={'Evaluate the current condition of the bridge'}
      />
    ),
    children: <BridgeConditionSlider />,
    style: panelStyle,
  },
];

export default function Collapse() {
  const { token } = theme.useToken();
  const panelStyle = {
    marginTop: 4,
    background: '#fff',
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };
  return (
    <AntdCollapse
      ghost
      style={{
        maxHeight: '100%',
        overflow: 'auto',
      }}
      items={getItems(panelStyle)}
      expandIconPosition={'end'}
      defaultActiveKey={['1']}
    />
  );
}
