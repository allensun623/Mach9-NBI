import { EntityCluster } from 'cesium';
import { CustomDataSource } from 'resium';

// eslint-disable-next-line react/prop-types
export default function BridgeCluster({ children }) {
  return (
    <CustomDataSource
      clustering={
        new EntityCluster({
          enabled: true,
          pixelRange: 40,
          minimumClusterSize: 40,
          clusterBillboards: false,
          clusterLabels: false,
          clusterPoints: true,
          show: true,
        })
      }
    >
      {children}
    </CustomDataSource>
  );
}
