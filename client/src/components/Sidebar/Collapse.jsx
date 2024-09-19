import { Collapse as AntdCollapse, theme } from 'antd';
import AdtSlider from './AdtSlider';
import AreaClassificationCheckbox from './AreaClassificationCheckbox';
import AreaTypeRadio from './AreaTypeRadio';
import YearSlider from './YearSlider';

const getItems = (panelStyle) => [
  {
    key: '1',
    label: 'Area Type',
    children: <AreaTypeRadio />,
    style: panelStyle,
  },
  {
    key: '2',
    label: 'Area Classification',
    children: <AreaClassificationCheckbox />,
    style: panelStyle,
  },
  {
    key: '3',
    label: 'Average Daily Traffic',
    children: <AdtSlider />,
    style: panelStyle,
  },
  {
    key: '4',
    label: 'Year Built/Rebuilt',
    children: <YearSlider />,
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
        height: '100%',
        maxHeight: '100%',
        overflow: 'auto',
      }}
      items={getItems(panelStyle)}
      expandIconPosition={'end'}
      defaultActiveKey={['1']}
    />
  );
}
