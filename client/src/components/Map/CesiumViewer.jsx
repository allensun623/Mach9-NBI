import { theme } from 'antd';
import { useState } from 'react';
import { Viewer } from 'resium';
import BridgesEntities from './BridgeClusters';
import CesiumCamera from './CesiumCamera';
import CesiumCameraFlyTo from './CesiumCameraFlyTo';

const mapStyle = (token) => ({
  background: token.colorFillAlter,
  borderRadius: token.borderRadiusLG,
  border: 'none',
  width: '100%',
  padding: token.paddingSM,
});

export default function CesiumViewer() {
  const { token } = theme.useToken();
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleUpdateZoomLevel = (z) => setZoomLevel(z);

  return (
    <Viewer style={mapStyle(token)}>
      <CesiumCamera handleUpdateZoomLevel={handleUpdateZoomLevel} />
      <CesiumCameraFlyTo />
      <BridgesEntities zoomLevel={zoomLevel} />
    </Viewer>
  );
}
