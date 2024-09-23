import { FilterOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip, Typography } from 'antd';
import { useFilterAction } from '../../context';
import Collapse from './Collapse';

const { Title } = Typography;

export default function Filter() {
  const { handleResetFilterState } = useFilterAction();
  return (
    <Flex style={{ height: '100%', flexDirection: 'column' }}>
      <Flex justify='space-between'>
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
    </Flex>
  );
}
