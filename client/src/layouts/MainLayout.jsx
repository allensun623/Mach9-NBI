import { Layout, theme, Typography } from 'antd';
import CesiumViewer from '../components/Map/CesiumViewer';
import Filter from '../components/Sidebar/Filter';
const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function MainLayout() {
  const { token } = theme.useToken();
  const headerStyle = {
    textAlign: 'center',
    height: 64,
    lineHeight: '64px',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    marginBottom: token.paddingSM,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const contentStyle = {
    // color: '#fff',
    // backgroundColor: '#fff',
    width: 'fit',
    borderRadius: token.paddingSM,
    display: 'flex',
  };
  const siderStyle = {
    padding: token.paddingSM,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    height: '100%',
    maxHeight: '100%',
  };

  const layoutStyle = {
    maxWidth: '100vw',
    maxHeight: '100vh',
    height: '100vh',
    backgroundColor: '#fff',
    padding: token.paddingSM,
  };

  const layoutCenterStyle = {
    backgroundColor: '#fff',
    gap: token.paddingSM,
  };

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Title level={3} style={{ margin: '0px' }}>
          Mach9 Project: NBI
        </Title>
      </Header>
      <Layout style={layoutCenterStyle}>
        <Sider width={250} style={siderStyle}>
          <Filter />
        </Sider>
        <Content style={contentStyle}>
          <CesiumViewer />
        </Content>
      </Layout>
    </Layout>
  );
}
