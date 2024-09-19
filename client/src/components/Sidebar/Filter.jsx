import { FilterOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip, Typography, theme } from 'antd';
import { useFilterAction } from '../../context/FilterContext';
import Collapse from './Collapse';

const { Title } = Typography;

export default function Filter() {
  const { handleResetFilterState } = useFilterAction();
  const { token } = theme.useToken();
  return (
    <>
      <Flex justify='space-between' style={{ padding: token.paddingSM }}>
        <Title level={4} style={{ margin: '0px' }}>
          Filters
        </Title>
        <Tooltip title='reset'>
          <Button
            shape='circle'
            icon={<FilterOutlined />}
            onClick={handleResetFilterState}
            style={{ backgroundColor: '#fff' }}
          />
        </Tooltip>
      </Flex>
      <Collapse />
    </>
  );
}
