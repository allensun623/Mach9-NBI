import CesiumMap from './components/Map/CesiumMap';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return <MainLayout content={<CesiumMap />} sider={'sider'} />;
}
